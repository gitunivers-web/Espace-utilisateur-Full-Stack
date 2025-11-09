import { AlertTriangle } from "lucide-react";

export function LegalNoticeBanner() {
  return (
    <div className="bg-card border-y py-3" data-testid="legal-notice-banner">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 text-sm">
          <AlertTriangle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <p className="font-semibold">
            Un crédit vous engage et doit être remboursé. Vérifiez vos capacités de remboursement avant de vous engager.
          </p>
        </div>
      </div>
    </div>
  );
}

interface RepresentativeExampleProps {
  amount: number;
  durationMonths: number;
  taeg: number;
  monthlyPayment: number;
  totalCost: number;
  interestType?: "fixe" | "variable";
}

export function RepresentativeExample({
  amount,
  durationMonths,
  taeg,
  monthlyPayment,
  totalCost,
  interestType = "fixe"
}: RepresentativeExampleProps) {
  return (
    <div className="p-6 bg-muted rounded-md space-y-4" data-testid="representative-example">
      <h3 className="font-semibold text-lg">Exemple représentatif</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">Montant emprunté</p>
          <p className="font-semibold">{amount.toLocaleString()} €</p>
        </div>
        <div>
          <p className="text-muted-foreground">Durée</p>
          <p className="font-semibold">{durationMonths} mois</p>
        </div>
        <div>
          <p className="text-muted-foreground">TAEG {interestType}</p>
          <p className="font-bold text-xl text-primary">{taeg.toFixed(2)} %</p>
        </div>
        <div>
          <p className="text-muted-foreground">Mensualité</p>
          <p className="font-semibold">{monthlyPayment.toLocaleString()} €</p>
        </div>
        <div>
          <p className="text-muted-foreground">Coût total du crédit</p>
          <p className="font-semibold">{(totalCost - amount).toLocaleString()} €</p>
        </div>
        <div>
          <p className="text-muted-foreground">Montant total dû</p>
          <p className="font-semibold">{totalCost.toLocaleString()} €</p>
        </div>
      </div>
    </div>
  );
}

export function LegalDisclaimers() {
  return (
    <div className="space-y-4 text-sm text-muted-foreground">
      <p className="font-semibold text-foreground">
        <AlertTriangle className="inline h-4 w-4 mr-2" />
        Un crédit vous engage et doit être remboursé. Vérifiez vos capacités de remboursement avant de vous engager.
      </p>
      <div className="space-y-2">
        <p>
          <strong>Droit de rétractation :</strong> Vous disposez d'un délai de 14 jours pour exercer votre droit de rétractation à compter de la signature du contrat de crédit.
        </p>
        <p>
          <strong>TAEG (Taux Annuel Effectif Global) :</strong> Le TAEG représente le coût total du crédit pour l'emprunteur, exprimé en pourcentage annuel du montant total du crédit. Il inclut le taux d'intérêt nominal ainsi que l'ensemble des frais obligatoires liés au crédit (frais de dossier, assurances obligatoires, etc.).
        </p>
        <p className="text-xs">
          Offre de prêt sous réserve d'acceptation de votre dossier par Altus Finance Group. Vous disposez d'un délai de réflexion de 14 jours pour accepter l'offre de crédit. Un crédit vous engage et doit être remboursé. Vérifiez vos capacités de remboursement avant de vous engager.
        </p>
      </div>
    </div>
  );
}
