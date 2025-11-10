import { useState } from "react";
import { useLogin } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useLocation, Link } from "wouter";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { ArrowLeft } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { useToast } from "@/hooks/use-toast";

export default function Login() {
  const [, setLocation] = useLocation();
  const login = useLogin();
  const { toast } = useToast();

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });
  const [requires2FA, setRequires2FA] = useState(false);
  const [twoFAEmail, setTwoFAEmail] = useState("");
  const [twoFACode, setTwoFACode] = useState("");
  const [verifying2FA, setVerifying2FA] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const result = await login.mutateAsync(loginForm);
      
      if ((result as any).requires2FA) {
        setRequires2FA(true);
        setTwoFAEmail((result as any).email);
      } else {
        setLocation("/mon-espace");
      }
    } catch (error) {
      console.error("Erreur de connexion:", error);
    }
  };

  const handleVerify2FA = async () => {
    if (twoFACode.length !== 6) {
      toast({
        title: "Erreur",
        description: "Le code doit contenir 6 chiffres",
        variant: "destructive",
      });
      return;
    }

    setVerifying2FA(true);
    try {
      const response = await fetch('/api/2fa/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ email: twoFAEmail, token: twoFACode }),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      toast({
        title: "Succès",
        description: "Connexion réussie",
      });

      setLocation("/mon-espace");
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Code invalide",
        variant: "destructive",
      });
    } finally {
      setVerifying2FA(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800 p-4">
      <Card className="w-full max-w-md relative">
        <Button
          variant="ghost"
          size="icon"
          asChild
          className="absolute left-4 top-4"
          data-testid="button-back-arrow"
        >
          <Link href="/">
            <ArrowLeft className="w-4 h-4" />
          </Link>
        </Button>
        <CardHeader className="text-center">
          <CardTitle className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
            Lendia Group
          </CardTitle>
          <CardDescription>Espace bancaire professionnel sécurisé</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="login">Connexion</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
              {!requires2FA ? (
                <form onSubmit={handleLogin} className="space-y-4 mt-4">
                  {login.error && (
                    <Alert variant="destructive">
                      <AlertDescription>
                        {(login.error as any)?.message || "Email ou mot de passe incorrect"}
                      </AlertDescription>
                    </Alert>
                  )}

                  <div className="space-y-2">
                    <Label htmlFor="login-email">Email</Label>
                    <Input
                      id="login-email"
                      type="email"
                      placeholder="votre.email@exemple.fr"
                      value={loginForm.email}
                      onChange={(e) => setLoginForm({ ...loginForm, email: e.target.value })}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="login-password">Mot de passe</Label>
                    <Input
                      id="login-password"
                      type="password"
                      placeholder="••••••••"
                      value={loginForm.password}
                      onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full" disabled={login.isPending} data-testid="button-login">
                    {login.isPending ? "Connexion..." : "Se connecter"}
                  </Button>

                  <div className="text-center">
                    <Button variant="ghost" asChild className="text-sm" data-testid="link-forgot-password">
                      <Link href="/forgot-password">Mot de passe oublié ?</Link>
                    </Button>
                  </div>

                  <div className="text-center space-y-2 mt-4">
                    <p className="text-sm text-muted-foreground">
                      Pas encore de compte ?{" "}
                      <Button variant="ghost" asChild className="p-0 h-auto" data-testid="link-register">
                        <Link href="/register">Créer un compte</Link>
                      </Button>
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Compte de démonstration : demo@lendia.fr / demo123
                    </p>
                  </div>
                </form>
              ) : (
                <div className="space-y-4 mt-4">
                  <Alert>
                    <AlertDescription>
                      Entrez le code à 6 chiffres généré par votre application d'authentification
                    </AlertDescription>
                  </Alert>

                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label>Code de vérification</Label>
                      <div className="flex justify-center">
                        <InputOTP
                          maxLength={6}
                          value={twoFACode}
                          onChange={setTwoFACode}
                          data-testid="input-2fa-login-code"
                        >
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </div>

                    <Button
                      onClick={handleVerify2FA}
                      className="w-full"
                      disabled={twoFACode.length !== 6 || verifying2FA}
                      data-testid="button-verify-2fa"
                    >
                      {verifying2FA ? "Vérification..." : "Vérifier"}
                    </Button>

                    <Button
                      variant="ghost"
                      onClick={() => {
                        setRequires2FA(false);
                        setTwoFACode("");
                        setTwoFAEmail("");
                      }}
                      className="w-full"
                      data-testid="button-back-to-login"
                    >
                      Retour à la connexion
                    </Button>
                  </div>
                </div>
              )}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
