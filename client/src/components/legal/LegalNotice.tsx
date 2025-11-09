import { AlertTriangle } from "lucide-react";
import { useTranslation } from "react-i18next";

export function LegalNoticeBanner() {
  const { t } = useTranslation();
  
  return (
    <div className="bg-card border-y py-3" data-testid="legal-notice-banner">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 text-sm">
          <AlertTriangle className="h-5 w-5 text-muted-foreground flex-shrink-0" />
          <p className="font-semibold">
            {t('legal.warning')}
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
  const { t } = useTranslation();
  
  return (
    <div className="p-6 bg-muted rounded-md space-y-4" data-testid="representative-example">
      <h3 className="font-semibold text-lg">{t('legal.representativeExample')}</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
        <div>
          <p className="text-muted-foreground">{t('legal.borrowedAmount')}</p>
          <p className="font-semibold">{amount.toLocaleString()} €</p>
        </div>
        <div>
          <p className="text-muted-foreground">{t('legal.duration')}</p>
          <p className="font-semibold">{durationMonths} {t('legal.months')}</p>
        </div>
        <div>
          <p className="text-muted-foreground">TAEG {t(`legal.${interestType}`)}</p>
          <p className="font-bold text-xl text-primary">{taeg.toFixed(2)} %</p>
        </div>
        <div>
          <p className="text-muted-foreground">{t('legal.monthlyPayment')}</p>
          <p className="font-semibold">{monthlyPayment.toLocaleString()} €</p>
        </div>
        <div>
          <p className="text-muted-foreground">{t('legal.totalCreditCost')}</p>
          <p className="font-semibold">{(totalCost - amount).toLocaleString()} €</p>
        </div>
        <div>
          <p className="text-muted-foreground">{t('legal.totalAmountDue')}</p>
          <p className="font-semibold">{totalCost.toLocaleString()} €</p>
        </div>
      </div>
    </div>
  );
}

export function LegalDisclaimers() {
  const { t } = useTranslation();
  
  return (
    <div className="space-y-4 text-sm text-muted-foreground">
      <p className="font-semibold text-foreground">
        <AlertTriangle className="inline h-4 w-4 mr-2" />
        {t('legal.warning')}
      </p>
      <div className="space-y-2">
        <p>
          <strong>{t('legal.withdrawalRight')} :</strong> {t('legal.withdrawalRightText')}
        </p>
        <p>
          <strong>{t('legal.taegTitle')} :</strong> {t('legal.taegText')}
        </p>
        <p className="text-xs">
          {t('legal.offerDisclaimer')}
        </p>
      </div>
    </div>
  );
}
