import { LoanSimulator } from "@/components/loan/LoanSimulator";

export default function Simulator() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">Simulateur de Prêt</h1>
          <p className="text-xl text-muted-foreground">
            Estimez le coût de votre prêt en quelques clics
          </p>
        </div>

        <LoanSimulator />

        <div className="mt-12 p-6 bg-muted/50 rounded-lg">
          <h2 className="font-semibold mb-4">À propos de cette simulation</h2>
          <ul className="space-y-2 text-sm text-muted-foreground">
            <li>• Cette simulation est donnée à titre indicatif et ne constitue pas une offre de prêt</li>
            <li>• Le taux et les mensualités définitifs seront établis après étude de votre dossier</li>
            <li>• Un crédit vous engage et doit être remboursé. Vérifiez vos capacités de remboursement avant de vous engager</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
