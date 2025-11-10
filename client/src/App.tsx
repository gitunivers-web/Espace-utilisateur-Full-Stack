import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import { PublicLayout } from "@/components/PublicLayout";
import Topbar from "@/components/Topbar";
import Dashboard from "@/pages/Dashboard";
import Comptes from "@/pages/Comptes";
import Prets from "@/pages/Prets";
import Transferts from "@/pages/Transferts";
import Historique from "@/pages/Historique";
import Parametres from "@/pages/Parametres";
import LoanApplicationsList from "@/pages/loan-applications-list";
import Login from "@/pages/Login";
import Home from "@/pages/home";
import Offers from "@/pages/offers";
import About from "@/pages/about";
import Contact from "@/pages/contact";
import HowItWorks from "@/pages/how-it-works";
import LoanApplication from "@/pages/loan-application";
import LegalNotice from "@/pages/legal-notice";
import PrivacyPolicy from "@/pages/privacy-policy";
import ForgotPassword from "@/pages/forgot-password";
import ResetPassword from "@/pages/reset-password";
import Register from "@/pages/register";
import RegisterParticular from "@/pages/register-particular";
import RegisterProfessional from "@/pages/register-professional";
import EmailConfirmation from "@/pages/email-confirmation";
import VerifyEmail from "@/pages/verify-email";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/lib/api";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { data: auth, isLoading, error } = useAuth();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (error || !auth?.user) {
    return <Redirect to="/auth/connexion" />;
  }

  return <Component />;
}

function PublicRouter() {
  return (
    <PublicLayout>
      <Switch>
        <Route path="/" component={Home} />
        <Route path="/offres" component={Offers} />
        <Route path="/a-propos" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/comment-ca-marche" component={HowItWorks} />
        <Route path="/mentions-legales" component={LegalNotice} />
        <Route path="/politique-confidentialite" component={PrivacyPolicy} />
        <Route component={NotFound} />
      </Switch>
    </PublicLayout>
  );
}

function ProtectedRouter() {
  const { data: auth } = useAuth();
  const style = {
    "--sidebar-width": "16rem",
    "--sidebar-width-icon": "3rem",
  };

  return (
    <SidebarProvider style={style as React.CSSProperties}>
      <div className="flex h-screen w-full">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <Topbar userName={auth?.user?.fullName || "Utilisateur"} />
          <main className="flex-1 overflow-auto">
            <Switch>
              <Route path="/mon-espace">
                {() => <ProtectedRoute component={Dashboard} />}
              </Route>
              <Route path="/mon-espace/demandes">
                {() => <ProtectedRoute component={LoanApplicationsList} />}
              </Route>
              <Route path="/mon-espace/nouvelle-demande">
                {() => <ProtectedRoute component={LoanApplication} />}
              </Route>
              <Route path="/mon-espace/comptes">
                {() => <ProtectedRoute component={Comptes} />}
              </Route>
              <Route path="/mon-espace/prets">
                {() => <ProtectedRoute component={Prets} />}
              </Route>
              <Route path="/mon-espace/transferts">
                {() => <ProtectedRoute component={Transferts} />}
              </Route>
              <Route path="/mon-espace/historique">
                {() => <ProtectedRoute component={Historique} />}
              </Route>
              <Route path="/mon-espace/parametres">
                {() => <ProtectedRoute component={Parametres} />}
              </Route>
              <Route component={NotFound} />
            </Switch>
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

function AppRoutes() {
  const [location] = useLocation();
  const { data: auth } = useAuth();

  if (location === "/auth/connexion" && auth?.user) {
    return <Redirect to="/mon-espace" />;
  }

  return (
    <Switch>
      <Route path="/auth/connexion" component={Login} />
      <Route path="/forgot-password" component={ForgotPassword} />
      <Route path="/reset-password" component={ResetPassword} />
      <Route path="/register" component={Register} />
      <Route path="/register/particular" component={RegisterParticular} />
      <Route path="/register/professional" component={RegisterProfessional} />
      <Route path="/email-confirmation" component={EmailConfirmation} />
      <Route path="/verify-email" component={VerifyEmail} />
      <Route path="/mon-espace">
        {() => <ProtectedRouter />}
      </Route>
      <Route path="/mon-espace/:rest*">
        {() => <ProtectedRouter />}
      </Route>
      <Route>
        {() => <PublicRouter />}
      </Route>
    </Switch>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <AppRoutes />
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
