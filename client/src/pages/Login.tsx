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

export default function Login() {
  const [, setLocation] = useLocation();
  const login = useLogin();

  const [loginForm, setLoginForm] = useState({ email: "", password: "" });

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login.mutateAsync(loginForm);
      setLocation("/");
    } catch (error) {
      console.error("Erreur de connexion:", error);
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
            Altus Finance Group
          </CardTitle>
          <CardDescription>Espace bancaire professionnel sécurisé</CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid w-full grid-cols-1">
              <TabsTrigger value="login">Connexion</TabsTrigger>
            </TabsList>

            <TabsContent value="login">
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
                  <Button variant="link" asChild className="text-sm" data-testid="link-forgot-password">
                    <Link href="/forgot-password">Mot de passe oublié ?</Link>
                  </Button>
                </div>

                <div className="text-center space-y-2 mt-4">
                  <p className="text-sm text-muted-foreground">
                    Pas encore de compte ?{" "}
                    <Button variant="link" asChild className="p-0 h-auto" data-testid="link-register">
                      <Link href="/register">Créer un compte</Link>
                    </Button>
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Compte de démonstration : sophie.martin@altusfinance.fr / password123
                  </p>
                </div>
              </form>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}
