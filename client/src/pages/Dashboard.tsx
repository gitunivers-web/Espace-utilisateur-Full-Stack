import InfoTicker from "@/components/InfoTicker";
import DashboardCard from "@/components/DashboardCard";
import VirtualCard from "@/components/VirtualCard";
import StatsChart from "@/components/StatsChart";
import { Wallet, CreditCard, TrendingUp, Banknote } from "lucide-react";
import { useAccounts, useCards, useLoans } from "@/lib/api";

export default function Dashboard() {
  const { data: accounts, isLoading: accountsLoading } = useAccounts();
  const { data: cards, isLoading: cardsLoading } = useCards();
  const { data: loans, isLoading: loansLoading } = useLoans();

  const totalBalance = accounts?.reduce((sum, acc) => sum + parseFloat(acc.balance), 0) || 0;
  const totalBorrowed = loans?.reduce((sum, loan) => sum + parseFloat(loan.borrowed), 0) || 0;
  const totalLoanAmount = loans?.reduce((sum, loan) => sum + parseFloat(loan.amount), 0) || 0;
  const borrowingCapacity = totalBalance * 3;
  const firstCard = cards?.[0];

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

        <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 lg:grid-cols-3">
          <StatsChart />
          <div className="lg:col-span-1">
            {cardsLoading || !firstCard ? (
              <div className="h-full min-h-[240px] sm:min-h-[280px] flex items-center justify-center text-muted-foreground">
                Chargement...
              </div>
            ) : (
              <VirtualCard
                cardHolder="SOPHIE MARTIN"
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
