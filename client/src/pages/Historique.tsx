import InfoTicker from "@/components/InfoTicker";
import TransactionTable from "@/components/TransactionTable";

export default function Historique() {
  return (
    <div className="flex flex-col min-h-screen">
      <InfoTicker />
      
      <div className="flex-1 p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Historique</h1>
          <p className="text-muted-foreground mt-1">
            Consultez toutes vos transactions
          </p>
        </div>

        <TransactionTable />
      </div>
    </div>
  );
}
