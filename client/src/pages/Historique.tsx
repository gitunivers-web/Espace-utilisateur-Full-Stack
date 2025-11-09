import InfoTicker from "@/components/InfoTicker";
import TransactionTable from "@/components/TransactionTable";

export default function Historique() {
  return (
    <div className="flex flex-col min-h-screen">
      <InfoTicker />
      
      <div className="flex-1 p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold">Historique</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Consultez toutes vos transactions
          </p>
        </div>

        <TransactionTable />
      </div>
    </div>
  );
}
