import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, User, Briefcase } from "lucide-react";

export default function Register() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-primary/5 via-background to-secondary/5">
      <Card className="w-full max-w-2xl">
        <CardHeader className="space-y-1">
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
          <CardTitle className="text-3xl text-center">Créer un compte</CardTitle>
          <CardDescription className="text-center text-base">
            Choisissez le type de compte qui correspond à vos besoins
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-6">
            <Card className="hover-elevate active-elevate-2 cursor-pointer transition-all" asChild>
              <Link href="/register/particular" data-testid="card-register-particular">
                <CardContent className="flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <div className="rounded-full bg-primary/10 p-6">
                    <User className="w-12 h-12 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-semibold">Particulier</h3>
                    <p className="text-muted-foreground">
                      Accédez aux offres de prêt personnel, immobilier et véhicule
                    </p>
                  </div>
                  <Button className="w-full" data-testid="button-register-particular">
                    S'inscrire comme particulier
                  </Button>
                </CardContent>
              </Link>
            </Card>

            <Card className="hover-elevate active-elevate-2 cursor-pointer transition-all" asChild>
              <Link href="/register/professional" data-testid="card-register-professional">
                <CardContent className="flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <div className="rounded-full bg-primary/10 p-6">
                    <Briefcase className="w-12 h-12 text-primary" />
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-2xl font-semibold">Professionnel</h3>
                    <p className="text-muted-foreground">
                      Accédez aux offres de prêt professionnel et investissement
                    </p>
                  </div>
                  <Button className="w-full" data-testid="button-register-professional">
                    S'inscrire comme professionnel
                  </Button>
                </CardContent>
              </Link>
            </Card>
          </div>

          <div className="text-center mt-6">
            <p className="text-sm text-muted-foreground">
              Vous avez déjà un compte ?{" "}
              <Button variant="link" asChild className="p-0 h-auto" data-testid="link-login">
                <Link href="/auth/connexion">Se connecter</Link>
              </Button>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
