import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  CreditCard,
  TrendingUp,
  ArrowRightLeft,
  History,
  Settings,
  LogOut,
  Building2,
} from "lucide-react";
import { Link, useLocation } from "wouter";
import { useToast } from "@/hooks/use-toast";

const menuItems = [
  { title: "Tableau de bord", url: "/", icon: LayoutDashboard },
  { title: "Comptes & Cartes", url: "/comptes", icon: CreditCard },
  { title: "Prêts & Financements", url: "/prets", icon: TrendingUp },
  { title: "Transferts", url: "/transferts", icon: ArrowRightLeft },
  { title: "Historique", url: "/historique", icon: History },
  { title: "Paramètres", url: "/parametres", icon: Settings },
];

export function AppSidebar() {
  const [location] = useLocation();
  const { toast } = useToast();

  const handleLogout = () => {
    toast({
      title: "Déconnexion",
      description: "Vous avez été déconnecté avec succès.",
    });
  };

  return (
    <Sidebar>
      <SidebarHeader className="p-6">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-lg bg-primary flex items-center justify-center">
            <Building2 className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="font-bold text-lg">Altus</h1>
            <p className="text-xs text-muted-foreground">Finance Group</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild isActive={location === item.url}>
                    <Link href={item.url} data-testid={`link-${item.title.toLowerCase().replace(/\s+/g, '-')}`}>
                      <item.icon className="h-4 w-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-muted/50">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-primary text-primary-foreground">
              SM
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Sophie Martin</p>
            <p className="text-xs text-muted-foreground">Compte Pro</p>
          </div>
        </div>
        <Button 
          variant="ghost" 
          className="w-full justify-start mt-2" 
          size="sm"
          data-testid="button-logout"
          onClick={handleLogout}
        >
          <LogOut className="h-4 w-4 mr-2" />
          Se déconnecter
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}
