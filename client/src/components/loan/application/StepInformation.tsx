/**
 * Étape 3 - Informations personnelles ou professionnelles
 * 
 * @component StepInformation
 * @description Troisième étape: formulaire discriminé selon le type de demandeur.
 * Les champs affichés et validés dépendent de applicationType (particular/professional)
 * 
 * @features
 * - Formulaire conditionnel selon type de demandeur
 * - Validation Zod discriminée
 * - Champs particuliers: revenu mensuel, statut d'emploi, projet
 * - Champs professionnels: nom entreprise, SIRET, CA, projet
 */

import { UseFormReturn } from "react-hook-form";
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { CreateLoanApplication } from "@shared/schema";

interface StepInformationProps {
  form: UseFormReturn<CreateLoanApplication>;
}

/**
 * Options de statut d'emploi pour les particuliers
 */
const EMPLOYMENT_STATUS_OPTIONS = [
  { value: "cdi", label: "CDI (Contrat à Durée Indéterminée)" },
  { value: "cdd", label: "CDD (Contrat à Durée Déterminée)" },
  { value: "freelance", label: "Indépendant / Freelance" },
  { value: "retired", label: "Retraité" },
  { value: "student", label: "Étudiant" },
  { value: "unemployed", label: "Sans emploi" },
  { value: "other", label: "Autre" },
];

export function StepInformation({ form }: StepInformationProps) {
  const applicationType = form.watch("applicationType");

  return (
    <div className="space-y-6">
      {/* Formulaire pour PARTICULIER */}
      {applicationType === "particular" && (
        <>
          <FormField
            control={form.control}
            name="monthlyIncome"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Revenu mensuel net *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="2500"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    value={field.value || ""}
                    data-testid="input-monthly-income"
                  />
                </FormControl>
                <FormDescription>
                  Votre revenu mensuel net (après impôts et cotisations)
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="employmentStatus"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Statut d'emploi *</FormLabel>
                <Select
                  value={field.value || ""}
                  onValueChange={field.onChange}
                >
                  <FormControl>
                    <SelectTrigger data-testid="select-employment-status">
                      <SelectValue placeholder="Sélectionnez votre statut" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {EMPLOYMENT_STATUS_OPTIONS.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="purpose"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Objet du prêt *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Décrivez votre projet (rénovation, achat de véhicule, etc.)"
                    rows={4}
                    {...field}
                    value={field.value || ""}
                    data-testid="textarea-purpose"
                  />
                </FormControl>
                <FormDescription>
                  Minimum 10 caractères
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}

      {/* Formulaire pour PROFESSIONNEL */}
      {applicationType === "professional" && (
        <>
          <FormField
            control={form.control}
            name="companyName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nom de l'entreprise *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="SARL Martin & Associés"
                    {...field}
                    value={field.value || ""}
                    data-testid="input-company-name"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="siret"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Numéro SIRET *</FormLabel>
                <FormControl>
                  <Input
                    placeholder="12345678901234"
                    maxLength={14}
                    {...field}
                    value={field.value || ""}
                    data-testid="input-siret"
                  />
                </FormControl>
                <FormDescription>
                  14 chiffres sans espaces
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="companyRevenue"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Chiffre d'affaires annuel *</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="100000"
                    {...field}
                    onChange={(e) => field.onChange(e.target.value ? Number(e.target.value) : undefined)}
                    value={field.value || ""}
                    data-testid="input-company-revenue"
                  />
                </FormControl>
                <FormDescription>
                  Chiffre d'affaires annuel en euros
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="purpose"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Objet du prêt *</FormLabel>
                <FormControl>
                  <Textarea
                    placeholder="Décrivez votre projet professionnel (investissement, trésorerie, équipement, etc.)"
                    rows={4}
                    {...field}
                    value={field.value || ""}
                    data-testid="textarea-purpose-professional"
                  />
                </FormControl>
                <FormDescription>
                  Minimum 10 caractères
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </>
      )}
    </div>
  );
}
