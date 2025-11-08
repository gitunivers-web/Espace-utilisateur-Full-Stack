import DashboardCard from '../DashboardCard';
import { Wallet } from 'lucide-react';

export default function DashboardCardExample() {
  return (
    <div className="p-8 bg-background">
      <DashboardCard
        title="Solde actuel"
        value="48 750,00 €"
        icon={Wallet}
        trend={{ value: "+12,5% ce mois", isPositive: true }}
      />
    </div>
  );
}
