/**
 * Étape 2 - Simulation du prêt
 * 
 * @component StepSimulation
 * @description Deuxième étape: l'utilisateur définit le montant et la durée du prêt.
 * Un simulateur calcule en temps réel les mensualités estimées.
 * 
 * @features
 * - Sliders pour montant et durée
 * - Calcul automatique des mensualités
 * - Respect des limites min/max du type de prêt sélectionné
 * - Affichage du taux et coût total
 */

import { useEffect } from "react";
import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Calculator } from "lucide-react";
import type { LoanType } from "@shared/schema";
import type { CreateLoanApplication } from "@shared/schema";

interface StepSimulationProps {
  form: UseFormReturn<CreateLoanApplication>;
  selectedLoanType: LoanType | null;
}

/**
 * Calcule les mensualités d'un prêt avec la formule standard
 * M = P * (r(1+r)^n) / ((1+r)^n - 1)
 * où M = mensualité, P = capital, r = taux mensuel, n = nombre de mois
 */
function calculateMonthlyPayment(amount: number, durationMonths: number, annualRate: number): number {
  const monthlyRate = annualRate / 100 / 12;
  if (monthlyRate === 0) return amount / durationMonths;
  
  const payment = amount * (monthlyRate * Math.pow(1 + monthlyRate, durationMonths)) / 
                  (Math.pow(1 + monthlyRate, durationMonths) - 1);
  
  return Math.round(payment * 100) / 100;
}

export function StepSimulation({ form, selectedLoanType }: StepSimulationProps) {
  const amount = form.watch("amount");
  const durationMonths = form.watch("durationMonths");

  // Calcul automatique des mensualités quand montant ou durée change
  useEffect(() => {
    if (selectedLoanType && amount && durationMonths) {
      const rate = Number(selectedLoanType.minRate);
      const monthlyPayment = calculateMonthlyPayment(amount, durationMonths, rate);
      
      form.setValue("estimatedRate", rate);
      form.setValue("estimatedMonthlyPayment", monthlyPayment);
    }
  }, [amount, durationMonths, selectedLoanType, form]);

  if (!selectedLoanType) {
    return (
      <Card>
        <CardContent className="p-8 text-center text-muted-foreground">
          Veuillez d'abord sélectionner un type de prêt
        </CardContent>
      </Card>
    );
  }

  const minAmount = Number(selectedLoanType.minAmount);
  const maxAmount = Number(selectedLoanType.maxAmount);
  const minDuration = selectedLoanType.minDurationMonths;
  const maxDuration = selectedLoanType.maxDurationMonths;

  const monthlyPayment = form.watch("estimatedMonthlyPayment");
  const totalCost = monthlyPayment * durationMonths;
  const totalInterest = totalCost - amount;

  return (
    <div className="space-y-6">
      {/* Informations sur le prêt sélectionné */}
      <Card className="bg-primary/5">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-sm">
            <Calculator className="h-4 w-4 text-primary" />
            <span className="font-medium">{selectedLoanType.name}</span>
            <span className="text-muted-foreground">
              - Taux à partir de {selectedLoanType.minRate}%
            </span>
          </div>
        </CardContent>
      </Card>

      {/* Montant du prêt */}
      <FormField
        control={form.control}
        name="amount"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Montant du prêt *</FormLabel>
            <div className="space-y-4">
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  min={minAmount}
                  max={maxAmount}
                  step={1000}
                  data-testid="input-amount"
                />
              </FormControl>
              <Slider
                value={[field.value]}
                onValueChange={([value]) => field.onChange(value)}
                min={minAmount}
                max={maxAmount}
                step={1000}
                className="w-full"
                data-testid="slider-amount"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{minAmount.toLocaleString()}€</span>
                <span className="font-semibold text-primary text-lg">
                  {field.value.toLocaleString()}€
                </span>
                <span>{maxAmount.toLocaleString()}€</span>
              </div>
            </div>
            <FormDescription>
              Montant entre {minAmount.toLocaleString()}€ et {maxAmount.toLocaleString()}€
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Durée du prêt */}
      <FormField
        control={form.control}
        name="durationMonths"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Durée du prêt *</FormLabel>
            <div className="space-y-4">
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                  min={minDuration}
                  max={maxDuration}
                  step={6}
                  data-testid="input-duration"
                />
              </FormControl>
              <Slider
                value={[field.value]}
                onValueChange={([value]) => field.onChange(value)}
                min={minDuration}
                max={maxDuration}
                step={6}
                className="w-full"
                data-testid="slider-duration"
              />
              <div className="flex justify-between text-xs text-muted-foreground">
                <span>{minDuration} mois</span>
                <span className="font-semibold text-primary text-lg">
                  {field.value} mois ({Math.round(field.value / 12 * 10) / 10} ans)
                </span>
                <span>{maxDuration} mois</span>
              </div>
            </div>
            <FormDescription>
              Durée entre {minDuration} et {maxDuration} mois
            </FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Récapitulatif de la simulation */}
      <Card className="bg-card">
        <CardContent className="p-6 space-y-4">
          <h3 className="font-semibold text-lg">Récapitulatif</h3>
          <div className="grid gap-3">
            <div className="flex justify-between items-center">
              <span className="text-muted-foreground">Mensualité estimée</span>
              <span className="text-2xl font-bold text-primary">
                {monthlyPayment.toLocaleString()}€/mois
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Taux d'intérêt</span>
              <span className="font-medium">{selectedLoanType.minRate}% / an</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Coût total du crédit</span>
              <span className="font-medium">{totalCost.toLocaleString()}€</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">Dont intérêts</span>
              <span className="font-medium">{totalInterest.toLocaleString()}€</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
