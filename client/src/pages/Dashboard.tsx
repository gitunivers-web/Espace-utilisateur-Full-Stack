import InfoTicker from "@/components/InfoTicker";
import DashboardCard from "@/components/DashboardCard";
import VirtualCard from "@/components/VirtualCard";
import StatsChart from "@/components/StatsChart";
import { Wallet, CreditCard, TrendingUp, Banknote } from "lucide-react";

export default function Dashboard() {
  return (
    <div className="flex flex-col min-h-screen">
      <InfoTicker />
      
      <div className="flex-1 p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Tableau de bord</h1>
          <p className="text-muted-foreground mt-1">
            Aperçu de votre activité financière
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Solde actuel"
            value="48 750,00 €"
            icon={Wallet}
            trend={{ value: "+12,5% ce mois", isPositive: true }}
          />
          <DashboardCard
            title="Crédit disponible"
            value="25 000,00 €"
            icon={CreditCard}
            trend={{ value: "+5,2% ce mois", isPositive: true }}
          />
          <DashboardCard
            title="Capacité d'emprunt"
            value="150 000,00 €"
            icon={TrendingUp}
            progress={65}
          />
          <DashboardCard
            title="Total emprunté"
            value="97 500,00 €"
            icon={Banknote}
            trend={{ value: "-8,3% ce mois", isPositive: true }}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <StatsChart />
          <div className="lg:col-span-1">
            <VirtualCard
              cardHolder="SOPHIE MARTIN"
              cardNumber="**** **** **** 4829"
              expiryDate="12/26"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
