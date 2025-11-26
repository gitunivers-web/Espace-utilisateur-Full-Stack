import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/lib/api";
import { Eye, EyeOff, LogIn, ArrowRight } from "lucide-react";
import { useTranslation } from "react-i18next";

const loginSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
  const { t } = useTranslation();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const { refetch } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (values: LoginFormValues) => {
    setIsLoading(true);
    try {
      const response = await apiRequest({
        method: "POST",
        path: "/auth/login",
        body: values,
      });

      if (response.success) {
        await refetch();
        navigate("/mon-espace");
        toast({
          title: "Connexion réussie",
          description: "Bienvenue dans votre espace personnel",
        });
      } else {
        toast({
          title: "Erreur de connexion",
          description: response.message || "Identifiants incorrects",
          variant: "destructive",
        });
      }
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la connexion",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-background via-primary/5 to-background overflow-hidden flex items-center justify-center">
      {/* Animated background gradients */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/8 rounded-full blur-3xl animate-pulse-glow" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/8 rounded-full blur-3xl animate-pulse-glow" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/3 right-1/3 w-64 h-64 bg-secondary/5 rounded-full blur-2xl" />
      </div>

      {/* Main container */}
      <div className="relative w-full max-w-md px-4 sm:px-6 lg:px-8">
        <div className="space-y-8 animate-slide-in-up">
          {/* Logo & Header */}
          <div className="text-center space-y-3">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl glass mb-6">
              <LogIn className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl font-bold tracking-tight">
              <span className="text-gradient">Bienvenue</span>
            </h1>
            <p className="text-muted-foreground text-lg">
              Accédez à votre espace personnel Solventis
            </p>
          </div>

          {/* Login Card */}
          <Card className="glass border-0 shadow-2xl p-8 space-y-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem className="form-group">
                      <label className="text-sm font-semibold block mb-2">Email</label>
                      <FormControl>
                        <Input
                          {...field}
                          type="email"
                          placeholder="votre@email.com"
                          className="input-premium"
                          disabled={isLoading}
                          data-testid="input-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Password Field */}
                <FormField
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem className="form-group">
                      <div className="flex items-center justify-between">
                        <label className="text-sm font-semibold">Mot de passe</label>
                        <a
                          href="/mot-de-passe-oublie"
                          className="text-xs font-medium text-primary hover:text-primary/80 transition-colors"
                          data-testid="link-forgot-password"
                        >
                          Oublié ?
                        </a>
                      </div>
                      <FormControl>
                        <div className="relative">
                          <Input
                            {...field}
                            type={showPassword ? "text" : "password"}
                            placeholder="••••••••"
                            className="input-premium pr-12"
                            disabled={isLoading}
                            data-testid="input-password"
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                            tabIndex={-1}
                            data-testid="button-toggle-password"
                          >
                            {showPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  className="w-full min-h-11 mt-6 btn-premium text-base font-semibold"
                  disabled={isLoading}
                  data-testid="button-submit-login"
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <span className="inline-block w-4 h-4 border-2 border-primary-foreground border-t-transparent rounded-full animate-spin" />
                      Connexion...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Se connecter
                      <ArrowRight className="w-5 h-5" />
                    </span>
                  )}
                </Button>
              </form>
            </Form>

            {/* Divider */}
            <div className="relative flex items-center gap-3">
              <div className="flex-1 h-px bg-border" />
              <span className="text-xs text-muted-foreground font-medium">OU</span>
              <div className="flex-1 h-px bg-border" />
            </div>

            {/* Demo Credentials Notice */}
            <div className="rounded-xl bg-accent/5 border border-accent/20 p-4 space-y-2">
              <p className="text-xs font-semibold text-foreground">Mode démo</p>
              <p className="text-xs text-muted-foreground">
                Email: <span className="font-mono font-medium text-foreground">demo@solventisgroup.fr</span>
              </p>
              <p className="text-xs text-muted-foreground">
                Mot de passe: <span className="font-mono font-medium text-foreground">demo123</span>
              </p>
            </div>
          </Card>

          {/* Footer */}
          <div className="text-center space-y-4">
            <p className="text-muted-foreground">
              Pas encore de compte ?{" "}
              <a
                href="/inscription"
                className="font-semibold text-primary hover:text-primary/80 transition-colors"
                data-testid="link-register"
              >
                Créez un compte
              </a>
            </p>

            {/* Social / Legal */}
            <div className="flex items-center justify-center gap-4 text-xs text-muted-foreground">
              <a href="/mentions-legales" className="hover:text-foreground transition-colors" data-testid="link-legal">
                Conditions
              </a>
              <span>•</span>
              <a href="/politique-confidentialite" className="hover:text-foreground transition-colors" data-testid="link-privacy">
                Confidentialité
              </a>
              <span>•</span>
              <a href="/contact" className="hover:text-foreground transition-colors" data-testid="link-contact">
                Aide
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Floating accent elements */}
      <div className="absolute top-10 left-10 w-20 h-20 rounded-full glass opacity-40 animate-float hidden md:block" style={{ animationDuration: "6s" }} />
      <div className="absolute bottom-20 right-10 w-32 h-32 rounded-full glass opacity-30 animate-float hidden md:block" style={{ animationDuration: "8s", animationDelay: "2s" }} />
    </div>
  );
}
