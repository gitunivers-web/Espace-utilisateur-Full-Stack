import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mail } from "lucide-react";
import { Link } from "wouter";

export default function EmailConfirmation() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="rounded-full bg-primary/10 p-3">
              <Mail className="h-8 w-8 text-primary" />
            </div>
          </div>
          <CardTitle className="text-2xl">Vérifiez votre email</CardTitle>
          <CardDescription>
            Nous avons envoyé un lien de vérification à votre adresse email
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Veuillez cliquer sur le lien dans l'email que nous vous avons envoyé pour activer votre compte. 
            Le lien est valable pendant 24 heures.
          </p>
          <p className="text-sm text-muted-foreground text-center">
            Si vous ne voyez pas l'email, vérifiez votre dossier spam.
          </p>
          <div className="flex flex-col gap-2 pt-4">
            <Link href="/connexion">
              <Button variant="outline" className="w-full" data-testid="button-login">
                Retour à la connexion
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
