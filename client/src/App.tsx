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
import Login from "@/pages/Login";
import Home from "@/pages/home";
import Offers from "@/pages/offers";
import Simulator from "@/pages/simulator";
import About from "@/pages/about";
import Contact from "@/pages/contact";
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
        <Route path="/simulateur" component={Simulator} />
        <Route path="/a-propos" component={About} />
        <Route path="/contact" component={Contact} />
        <Route path="/comment-ca-marche" component={About} />
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
