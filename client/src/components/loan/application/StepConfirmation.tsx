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
import type { LoanType } from "@shared/schema";
import type { CreateLoanApplication } from "@shared/schema";
import { LegalDisclaimers } from "@/components/legal/LegalNotice";

interface StepConfirmationProps {
  form: UseFormReturn<CreateLoanApplication>;
  selectedLoanType: LoanType | null;
}

/**
 * Labels pour les statuts d'emploi
 */
const EMPLOYMENT_STATUS_LABELS: Record<string, string> = {
  cdi: "CDI (Contrat à Durée Indéterminée)",
  cdd: "CDD (Contrat à Durée Déterminée)",
  freelance: "Indépendant / Freelance",
  retired: "Retraité",
  student: "Étudiant",
  unemployed: "Sans emploi",
  other: "Autre",
};

export function StepConfirmation({ form, selectedLoanType }: StepConfirmationProps) {
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
          <p className="font-medium">Vérifiez vos informations</p>
          <p className="text-sm text-muted-foreground">
            Assurez-vous que toutes les informations sont correctes avant de soumettre votre demande.
            Une fois envoyée, votre demande sera étudiée par notre équipe sous 48h.
          </p>
        </div>
      </div>

      {/* Informations du prêt */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Prêt sélectionné</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          {selectedLoanType ? (
            <>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Type de prêt</span>
                <span className="font-medium">{selectedLoanType.name}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted-foreground">Catégorie</span>
                <Badge variant="secondary">
                  {applicationType === "particular" ? "Particulier" : "Professionnel"}
                </Badge>
              </div>
            </>
          ) : (
            <p className="text-sm text-muted-foreground">Type de prêt non sélectionné</p>
          )}
        </CardContent>
      </Card>

      {/* Simulation financière */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Simulation financière</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Montant demandé</span>
            <span className="font-semibold text-lg">{amount.toLocaleString()}€</span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Durée</span>
            <span className="font-medium">
              {durationMonths} mois ({Math.round(durationMonths / 12 * 10) / 10} ans)
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Taux d'intérêt</span>
            <span className="font-medium">{estimatedRate}% / an</span>
          </div>
          <div className="border-t pt-3 flex items-center justify-between">
            <span className="text-muted-foreground">Mensualité estimée</span>
            <span className="font-bold text-xl text-primary">
              {estimatedMonthlyPayment.toLocaleString()}€/mois
            </span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Coût total</span>
            <span className="font-medium">{totalCost.toLocaleString()}€</span>
          </div>
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Dont intérêts</span>
            <span className="font-medium">{totalInterest.toLocaleString()}€</span>
          </div>
        </CardContent>
      </Card>

      {/* Informations personnelles (PARTICULIER) */}
      {applicationType === "particular" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Vos informations</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Revenu mensuel net</span>
              <span className="font-medium">{monthlyIncome?.toLocaleString()}€</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Statut d'emploi</span>
              <span className="font-medium">
                {employmentStatus ? EMPLOYMENT_STATUS_LABELS[employmentStatus] || employmentStatus : "-"}
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-sm">Objet du prêt</span>
              <p className="text-sm bg-muted/50 p-3 rounded-md">{purpose}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Informations professionnelles */}
      {applicationType === "professional" && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Informations de l'entreprise</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Nom de l'entreprise</span>
              <span className="font-medium">{companyName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">SIRET</span>
              <span className="font-mono text-sm">{siret}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Chiffre d'affaires annuel</span>
              <span className="font-medium">{companyRevenue?.toLocaleString()}€</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-muted-foreground text-sm">Objet du prêt</span>
              <p className="text-sm bg-muted/50 p-3 rounded-md">{purpose}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Informations légales */}
      <Card className="bg-muted/30">
        <CardContent className="p-4 text-sm text-muted-foreground space-y-2">
          <p>
            <strong>Informations importantes :</strong>
          </p>
          <ul className="list-disc list-inside space-y-1 ml-2">
            <li>Votre demande sera étudiée sous 48h ouvrées</li>
            <li>Des justificatifs vous seront demandés (pièce d'identité, justificatif de domicile, de revenus)</li>
            <li>L'acceptation définitive est soumise à l'étude de votre dossier complet</li>
          </ul>
        </CardContent>
      </Card>

      <LegalDisclaimers />
    </div>
  );
}
