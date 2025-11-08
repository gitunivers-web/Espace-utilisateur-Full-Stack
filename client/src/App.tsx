import { Switch, Route, Redirect, useLocation } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/app-sidebar";
import Topbar from "@/components/Topbar";
import Dashboard from "@/pages/Dashboard";
import Comptes from "@/pages/Comptes";
import Prets from "@/pages/Prets";
import Transferts from "@/pages/Transferts";
import Historique from "@/pages/Historique";
import Parametres from "@/pages/Parametres";
import Login from "@/pages/Login";
import NotFound from "@/pages/not-found";
import { useAuth } from "@/lib/api";

function ProtectedRoute({ component: Component }: { component: React.ComponentType }) {
  const { data: auth, isLoading, error } = useAuth();
  const [location] = useLocation();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  if (error || !auth?.user) {
    return <Redirect to="/login" />;
  }

  return <Component />;
}

function Router() {
  const { data: auth } = useAuth();
  const [location] = useLocation();

  if (location === "/login" && auth?.user) {
    return <Redirect to="/" />;
  }

  return (
    <Switch>
      <Route path="/login" component={Login} />
      <Route path="/">
        {() => <ProtectedRoute component={Dashboard} />}
      </Route>
      <Route path="/comptes">
        {() => <ProtectedRoute component={Comptes} />}
      </Route>
      <Route path="/prets">
        {() => <ProtectedRoute component={Prets} />}
      </Route>
      <Route path="/transferts">
        {() => <ProtectedRoute component={Transferts} />}
      </Route>
      <Route path="/historique">
        {() => <ProtectedRoute component={Historique} />}
      </Route>
      <Route path="/parametres">
        {() => <ProtectedRoute component={Parametres} />}
      </Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function AuthenticatedLayout() {
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
            <Router />
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}

export default function App() {
  const [location] = useLocation();
  const isLoginPage = location === "/login";

  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        {isLoginPage ? (
          <Router />
        ) : (
          <AuthenticatedLayout />
        )}
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}
