/**
 * Étape 4 - Confirmation et récapitulatif
 * 
 * @component StepConfirmation
 * @description Dernière étape: affiche un récapitulatif complet de la demande
 * avant soumission. L'utilisateur peut vérifier toutes les informations saisies.
 * 
 * @features
 * - Récapitulatif complet de la demande
 * - Affichage conditionnel selon type de demandeur
 * - Informations du prêt sélectionné
 * - Simulation financière
 * - Informations personnelles/professionnelles
 */

import { UseFormReturn } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { LoanType } from "@shared/schema";
import type { CreateLoanApplication } from "@shared/schema";
import { LegalDisclaimers } from "@/components/legal/LegalNotice";

interface StepConfirmationProps {
  form: UseFormReturn<CreateLoanApplication>;
  selectedLoanType: LoanType | null;
}

export function StepConfirmation({ form, selectedLoanType }: StepConfirmationProps) {
  const { t } = useTranslation();
  const formValues = form.getValues();
  const { 
    applicationType,
    amount,
    durationMonths,
    estimatedMonthlyPayment,
    estimatedRate,
    purpose
  } = formValues;

  // Propriétés spécifiques selon le type de demandeur
  const monthlyIncome = applicationType === "particular" ? formValues.monthlyIncome : undefined;
  const employmentStatus = applicationType === "particular" ? formValues.employmentStatus : undefined;
  const companyName = applicationType === "professional" ? formValues.companyName : undefined;
  const siret = applicationType === "professional" ? formValues.siret : undefined;
  const companyRevenue = applicationType === "professional" ? formValues.companyRevenue : undefined;

  const totalCost = estimatedMonthlyPayment * durationMonths;
  const totalInterest = totalCost - amount;

  return (
    <div className="space-y-6">
      {/* Message de confirmation */}
      <div className="flex items-start gap-3 p-4 bg-primary/10 rounded-md">
        <CheckCircle2 className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-medium">{t('loanApplication.stepConfirmation.verifyInfo')}</p>
          <p className="text-sm text-muted-foreground">
            {t('loanApplication.stepConfirmation.verifyInfoDesc')}
          </p>
        </div>
      </div>

      {/* Informations du prêt */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('loanApplication.stepConfirmation.selectedLoan')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {selectedLoanType ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('loanApplication.stepConfirmation.loanType')}</span>
                <span className="font-medium">{selectedLoanType.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">{t('loanApplication.stepConfirmation.category')}</span>
                <Badge variant="secondary">
                  {t(`loan.${applicationType}`)}
                </Badge>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">{t('loanApplication.stepConfirmation.loanNotSelected')}</p>
          )}
        </CardContent>
      </Card>

      {/* Simulation financière */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">{t('loanApplication.stepConfirmation.financialSimulation')}</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{t('loanApplication.stepConfirmation.requestedAmount')}</span>
            <span className="font-semibold text-lg">{amount.toLocaleString()}€</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{t('loan.duration')}</span>
            <span className="font-medium">
              {durationMonths} {t('simulator.months')} ({Math.round(durationMonths / 12 * 10) / 10} {t('common.years')})
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">{t('loanApplication.stepConfirmation.interestRate')}</span>
            <span className="font-medium">{estimatedRate}%{t('loanApplication.stepSimulation.perYear')}</span>
          </div>
          <div className="border-t pt-3 flex items-center justify-between">
            <span className="text-muted-foreground">{t('loanApplication.stepConfirmation.estimatedMonthly')}</span>
            <span className="font-bold text-xl text-primary">
              {estimatedMonthlyPayment.toLocaleString()}€{t('loanApplication.stepSimulation.perMonth')}
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t('loanApplication.stepSimulation.totalCost')}</span>
            <span className="font-medium">{totalCost.toLocaleString()}€</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">{t('loanApplication.stepConfirmation.including')} {t('simulator.interest')}</span>
            <span className="font-medium">{totalInterest.toLocaleString()}€</span>
          </div>
        </CardContent>
      </Card>

      {/* Informations personnelles (PARTICULIER) */}
      {applicationType === "particular" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('loanApplication.stepConfirmation.yourInfo')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t('loanApplication.stepInformation.monthlyIncome')}</span>
              <span className="font-medium">{monthlyIncome?.toLocaleString()}€</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t('loanApplication.stepInformation.employmentStatus')}</span>
              <span className="font-medium">
                {employmentStatus ? t(`employmentStatus.${employmentStatus}`) : "-"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-sm">{t('loanApplication.stepInformation.loanPurpose')}</span>
              <p className="text-sm bg-muted/50 p-3 rounded-md">{purpose}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Informations professionnelles */}
      {applicationType === "professional" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{t('loanApplication.stepConfirmation.companyInfo')}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t('loanApplication.stepInformation.companyName')}</span>
              <span className="font-medium">{companyName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t('loanApplication.stepInformation.siret')}</span>
              <span className="font-mono text-sm">{siret}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">{t('loanApplication.stepInformation.annualRevenue')}</span>
              <span className="font-medium">{companyRevenue?.toLocaleString()}€</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-sm">{t('loanApplication.stepInformation.loanPurpose')}</span>
              <p className="text-sm bg-muted/50 p-3 rounded-md">{purpose}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Informations légales */}
      <Card className="bg-muted/30">
        <CardContent className="p-4 text-sm text-muted-foreground space-y-2">
          <p>
            <strong>{t('loanApplication.stepConfirmation.importantInfo')}</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>{t('loanApplication.stepConfirmation.reviewTime')}</li>
            <li>{t('loanApplication.stepConfirmation.documentsRequired')}</li>
            <li>{t('loanApplication.stepConfirmation.finalApproval')}</li>
          </ul>
        </CardContent>
      </Card>

      <LegalDisclaimers />
    </div>
  );
}
