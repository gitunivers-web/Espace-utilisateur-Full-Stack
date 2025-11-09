/**
 * Étape 1 - Sélection du type de prêt
 * 
 * @component StepLoanType
 * @description Première étape du wizard: l'utilisateur choisit le type de prêt
 * (Prêt Personnel, Crédit Auto, etc.) et le type de demandeur (particulier/professionnel)
 * 
 * @features
 * - Affichage des types de prêts disponibles sous forme de cartes
 * - Sélection du type de demandeur (particulier/professionnel)
 * - Filtre des prêts par catégorie
 * - Validation: loanTypeId et applicationType requis
 */

import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building2, User } from "lucide-react";
import { useTranslation } from "react-i18next";
import type { LoanType } from "@shared/schema";
import type { CreateLoanApplication } from "@shared/schema";

interface StepLoanTypeProps {
  form: UseFormReturn<CreateLoanApplication>;
  loanTypes: LoanType[];
}

export function StepLoanType({ form, loanTypes }: StepLoanTypeProps) {
  const { t } = useTranslation();
  const selectedType = form.watch("applicationType");
  const selectedLoanTypeId = form.watch("loanTypeId");

  // Filtrer les types de prêts selon le type de demandeur
  const filteredLoanTypes = loanTypes.filter((loan) => 
    selectedType === "particular" 
      ? loan.category === "particular" 
      : loan.category === "professional"
  );

  return (
    <div className="space-y-6">
      {/* Choix du type de demandeur */}
      <FormField
        control={form.control}
        name="applicationType"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('loanApplication.stepLoanType.youAre')}</FormLabel>
            <FormControl>
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="grid grid-cols-2 gap-4"
                data-testid="radio-applicant-type"
              >
                <label
                  htmlFor="particular"
                  className={`cursor-pointer ${
                    field.value === "particular" ? "ring-2 ring-primary" : ""
                  } rounded-md`}
                >
                  <Card className="hover-elevate">
                    <CardContent className="p-4 flex items-center gap-3">
                      <RadioGroupItem value="particular" id="particular" />
                      <div className="flex items-center gap-2">
                        <User className="h-5 w-5 text-primary" />
                        <span className="font-medium">{t('loan.particular')}</span>
                      </div>
                    </CardContent>
                  </Card>
                </label>

                <label
                  htmlFor="professional"
                  className={`cursor-pointer ${
                    field.value === "professional" ? "ring-2 ring-primary" : ""
                  } rounded-md`}
                >
                  <Card className="hover-elevate">
                    <CardContent className="p-4 flex items-center gap-3">
                      <RadioGroupItem value="professional" id="professional" />
                      <div className="flex items-center gap-2">
                        <Building2 className="h-5 w-5 text-primary" />
                        <span className="font-medium">{t('loan.professional')}</span>
                      </div>
                    </CardContent>
                  </Card>
                </label>
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Sélection du type de prêt */}
      <FormField
        control={form.control}
        name="loanTypeId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{t('loanApplication.stepLoanType.chooseLoanType')}</FormLabel>
            <FormControl>
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                className="grid gap-4"
                data-testid="radio-loan-type"
              >
                {filteredLoanTypes.map((loanType) => (
                  <label
                    key={loanType.id}
                    htmlFor={loanType.id}
                    className={`cursor-pointer ${
                      field.value === loanType.id ? "ring-2 ring-primary" : ""
                    } rounded-md`}
                  >
                    <Card className="hover-elevate">
                      <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                          <RadioGroupItem value={loanType.id} id={loanType.id} />
                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between gap-2 flex-wrap">
                              <h4 className="font-semibold">{loanType.name}</h4>
                              <Badge variant="secondary">
                                {t('loan.rateFrom')} {loanType.minRate}%
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {loanType.description}
                            </p>
                            <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                              <span>
                                {t('loan.amount')}: {Number(loanType.minAmount).toLocaleString()}€ -{" "}
                                {Number(loanType.maxAmount).toLocaleString()}€
                              </span>
                              <span>•</span>
                              <span>
                                {t('loan.duration')}: {loanType.minDurationMonths} - {loanType.maxDurationMonths} {t('simulator.months')}
                              </span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </label>
                ))}

                {filteredLoanTypes.length === 0 && (
                  <Card>
                    <CardContent className="p-8 text-center text-muted-foreground">
                      {t('loan.noOffers')}
                    </CardContent>
                  </Card>
                )}
              </RadioGroup>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
}
