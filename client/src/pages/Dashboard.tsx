import InfoTicker from "@/components/InfoTicker";
import DashboardCard from "@/components/DashboardCard";
import VirtualCard from "@/components/VirtualCard";
import StatsChart from "@/components/StatsChart";
import { Wallet, CreditCard, TrendingUp, Banknote, ArrowRightLeft, History, FileText } from "lucide-react";
import { useAccounts, useCards, useLoans, useAuth } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "wouter";

export default function Dashboard() {
  const { data: accounts, isLoading: accountsLoading } = useAccounts();
  const { data: cards, isLoading: cardsLoading } = useCards();
  const { data: loans, isLoading: loansLoading } = useLoans();
  const { data: auth } = useAuth();

  const totalBalance = accounts?.reduce((sum, acc) => sum + parseFloat(acc.balance), 0) || 0;
  const totalBorrowed = loans?.reduce((sum, loan) => sum + parseFloat(loan.borrowed), 0) || 0;
  const totalLoanAmount = loans?.reduce((sum, loan) => sum + parseFloat(loan.amount), 0) || 0;
  const borrowingCapacity = totalBalance * 3;
  const firstCard = cards?.[0];

  const shortcuts = [
    {
      title: "Faire une demande de prêt",
      description: "Simulez et demandez un prêt",
      icon: TrendingUp,
      href: "/prets",
      color: "bg-chart-1/10",
      iconColor: "text-chart-1",
    },
    {
      title: "Voir l'historique",
      description: "Consultez vos transactions",
      icon: History,
      href: "/historique",
      color: "bg-chart-2/10",
      iconColor: "text-chart-2",
    },
    {
      title: "Faire un virement",
      description: "Transférez de l'argent",
      icon: ArrowRightLeft,
      href: "/transferts",
      color: "bg-chart-3/10",
      iconColor: "text-chart-3",
    },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <InfoTicker />
      
      <div className="flex-1 p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold">Tableau de bord</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Aperçu de votre activité financière
          </p>
        </div>

        <div className="grid gap-3 sm:gap-4 md:gap-6 grid-cols-1 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardCard
            title="Solde actuel"
            value={accountsLoading ? "..." : `${totalBalance.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`}
            icon={Wallet}
            trend={{ value: "+12,5% ce mois", isPositive: true }}
          />
          <DashboardCard
            title="Crédit disponible"
            value={accountsLoading ? "..." : `${(totalBalance * 0.5).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`}
            icon={CreditCard}
            trend={{ value: "+5,2% ce mois", isPositive: true }}
          />
          <DashboardCard
            title="Capacité d'emprunt"
            value={accountsLoading ? "..." : `${borrowingCapacity.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`}
            icon={TrendingUp}
            progress={loansLoading ? 0 : Math.round((totalBorrowed / borrowingCapacity) * 100)}
          />
          <DashboardCard
            title="Total emprunté"
            value={loansLoading ? "..." : `${totalBorrowed.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €`}
            icon={Banknote}
            trend={{ value: "-8,3% ce mois", isPositive: true }}
          />
        </div>

        {/* Raccourcis rapides */}
        <div>
          <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Raccourcis rapides</h2>
          <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
            {shortcuts.map((shortcut) => (
              <Link key={shortcut.href} href={shortcut.href}>
                <Card 
                  className="hover-elevate cursor-pointer transition-all"
                  data-testid={`card-shortcut-${shortcut.title.toLowerCase().replace(/\s+/g, '-')}`}
                >
                  <CardContent className="p-4 sm:p-5">
                    <div className="flex items-start gap-3 sm:gap-4">
                      <div className={`h-10 w-10 sm:h-12 sm:w-12 rounded-lg ${shortcut.color} flex items-center justify-center flex-shrink-0`}>
                        <shortcut.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${shortcut.iconColor}`} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm sm:text-base mb-0.5">{shortcut.title}</h3>
                        <p className="text-xs sm:text-sm text-muted-foreground">{shortcut.description}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        </div>

        <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 lg:grid-cols-3">
          <StatsChart />
          <div className="lg:col-span-1">
            {cardsLoading || !firstCard ? (
              <div className="h-full min-h-[240px] sm:min-h-[280px] flex items-center justify-center text-muted-foreground">
                Chargement...
              </div>
            ) : (
              <VirtualCard
                cardHolder={auth?.user?.fullName?.toUpperCase() || "TITULAIRE"}
                cardNumber={firstCard.cardNumber}
                expiryDate={firstCard.expiryDate}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
