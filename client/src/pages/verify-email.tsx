import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, Loader2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";

export default function VerifyEmail() {
  const [, setLocation] = useLocation();
  const [status, setStatus] = useState<"loading" | "success" | "error">("loading");
  const [message, setMessage] = useState("");

  useEffect(() => {
    const verifyEmail = async () => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");

      if (!token) {
        setStatus("error");
        setMessage("Token de vérification manquant");
        return;
      }

      try {
        const response = await fetch(`/api/auth/verify-email?token=${token}`, {
          credentials: "include",
        });
        
        const data = await response.json();

        if (response.ok) {
          setStatus("success");
          setMessage("Votre email a été vérifié avec succès !");
          setTimeout(() => {
            setLocation("/mon-espace");
          }, 2000);
        } else {
          setStatus("error");
          setMessage(data.error || "Une erreur est survenue lors de la vérification");
        }
      } catch (error) {
        setStatus("error");
        setMessage("Une erreur est survenue lors de la vérification");
      }
    };

    verifyEmail();
  }, [setLocation]);

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === "loading" && (
              <div className="rounded-full bg-primary/10 p-3">
                <Loader2 className="h-8 w-8 text-primary animate-spin" data-testid="icon-loading" />
              </div>
            )}
            {status === "success" && (
              <div className="rounded-full bg-green-500/10 p-3">
                <CheckCircle className="h-8 w-8 text-green-500" data-testid="icon-success" />
              </div>
            )}
            {status === "error" && (
              <div className="rounded-full bg-destructive/10 p-3">
                <XCircle className="h-8 w-8 text-destructive" data-testid="icon-error" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl">
            {status === "loading" && "Vérification en cours..."}
            {status === "success" && "Email vérifié !"}
            {status === "error" && "Erreur de vérification"}
          </CardTitle>
          <CardDescription data-testid="text-message">
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {status === "success" && (
            <p className="text-sm text-muted-foreground text-center">
              Vous allez être redirigé vers votre espace personnel...
            </p>
          )}
          {status === "error" && (
            <div className="flex flex-col gap-2">
              <Button 
                onClick={() => setLocation("/auth/connexion")} 
                variant="outline" 
                className="w-full"
                data-testid="button-login"
              >
                Aller à la page de connexion
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
