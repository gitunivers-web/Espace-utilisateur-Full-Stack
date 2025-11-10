/**
 * Page Demande de Prêt - Wizard multi-étapes pour soumettre une demande
 * 
 * @component LoanApplication
 * @description Page publique contenant un formulaire multi-étapes (wizard) pour
 * soumettre une demande de prêt. Le formulaire utilise react-hook-form avec une
 * validation Zod à chaque étape.
 * 
 * @route /demande
 * @layout PublicLayout
 * 
 * @wizard_steps
 * 1. Sélection du type de prêt (particulier/professionnel)
 * 2. Simulation - Montant et durée
 * 3. Informations personnelles ou professionnelles (selon type)
 * 4. Confirmation et soumission
 * 
 * @features
 * - Validation par étape avec Zod
 * - Navigation avec sauvegarde de progression
 * - Récapitulatif en temps réel
 * - Mutation API avec gestion d'erreurs
 * - Redirection vers espace client après soumission
 */

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useLocation } from "wouter";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import { Stepper, Step } from "@/components/loan/Stepper";
import { useLoanWizard } from "@/hooks/use-loan-wizard";
import { useLoanTypes, useCreateLoanApplication } from "@/lib/queries";
import { useToast } from "@/hooks/use-toast";
import { Loader2, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import { createLoanApplicationSchema, type CreateLoanApplication } from "@shared/schema";
import type { LoanType } from "@shared/schema";

// Import des composants d'étapes
import { StepLoanType } from "@/components/loan/application/StepLoanType";
import { StepSimulation } from "@/components/loan/application/StepSimulation";
import { StepInformation } from "@/components/loan/application/StepInformation";
import { StepDocuments } from "@/components/loan/application/StepDocuments";
import { StepConfirmation } from "@/components/loan/application/StepConfirmation";

/**
 * Configuration des étapes du wizard
 */
const WIZARD_STEPS: Step[] = [
  { id: 1, label: "Type de prêt", description: "Choisissez votre prêt" },
  { id: 2, label: "Simulation", description: "Montant et durée" },
  { id: 3, label: "Vos informations", description: "Complétez votre profil" },
  { id: 4, label: "Documents", description: "Pièces justificatives" },
  { id: 5, label: "Confirmation", description: "Vérifiez et envoyez" },
];

/**
 * Type de données du formulaire complet
 * Utilise le schéma de validation de shared/schema.ts
 */
type LoanApplicationFormData = CreateLoanApplication;

export default function LoanApplication() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  
  // Récupération des types de prêts disponibles
  const { data: loanTypes, isLoading: isLoadingTypes } = useLoanTypes();
  
  // Hook wizard pour gérer la navigation entre étapes
  const {
    currentStep,
    isFirstStep,
    isLastStep,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    canGoToStep,
  } = useLoanWizard(WIZARD_STEPS.length);

  // État local pour le type de prêt sélectionné
  const [selectedLoanType, setSelectedLoanType] = useState<LoanType | null>(null);

  // État pour suivre si les documents requis sont uploadés
  const [hasAllDocuments, setHasAllDocuments] = useState(false);

  // Mutation pour créer la demande de prêt
  const createApplication = useCreateLoanApplication();

  /**
   * Formulaire react-hook-form avec validation Zod
   * Note: Nous utilisons une seule instance de form pour toutes les étapes
   */
  const form = useForm<LoanApplicationFormData>({
    resolver: zodResolver(createLoanApplicationSchema),
    mode: "onChange",
    defaultValues: {
      applicationType: "particular",
      amount: 10000,
      durationMonths: 24,
      estimatedRate: 0.5,
      estimatedMonthlyPayment: 0,
    },
  });

  // Écoute les changements de loanTypeId pour mettre à jour le type sélectionné
  const loanTypeId = form.watch("loanTypeId");
  useEffect(() => {
    if (loanTypeId && loanTypes) {
      const type = loanTypes.find((t) => t.id === loanTypeId);
      setSelectedLoanType(type || null);
    }
  }, [loanTypeId, loanTypes]);

  /**
   * Mise à jour du title pour le SEO
   */
  useEffect(() => {
    document.title = "Demander un prêt | Lendia";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Faites votre demande de prêt en ligne en quelques minutes. Processus simple et rapide avec réponse sous 48h."
      );
    }
  }, []);

  /**
   * Validation avant de passer à l'étape suivante
   * Vérifie que les champs de l'étape courante sont valides
   */
  const validateCurrentStep = async (): Promise<boolean> => {
    switch (currentStep) {
      case 1:
        return await form.trigger(["loanTypeId", "applicationType"]);
      case 2:
        return await form.trigger(["amount", "durationMonths", "estimatedRate", "estimatedMonthlyPayment"]);
      case 3:
        // Pour l'étape 3, on valide simplement le formulaire complet
        // car les champs dépendent du type de demandeur (discriminated union)
        return await form.trigger();
      case 4:
        // Étape documents - vérifier que tous les documents requis sont uploadés
        if (!hasAllDocuments) {
          toast({
            title: "Documents manquants",
            description: "Veuillez télécharger tous les documents obligatoires avant de continuer.",
            variant: "destructive",
          });
          return false;
        }
        return true;
      case 5:
        // Dernière étape, validation complète
        return true;
      default:
        return true;
    }
  };

  /**
   * Handler pour passer à l'étape suivante avec validation
   */
  const handleNext = async () => {
    const isValid = await validateCurrentStep();
    if (isValid) {
      await goToNextStep();
    } else {
      toast({
        title: "Informations manquantes",
        description: "Veuillez remplir tous les champs obligatoires avant de continuer.",
        variant: "destructive",
      });
    }
  };

  /**
   * Soumission finale du formulaire
   */
  const onSubmit = async (data: LoanApplicationFormData) => {
    try {
      await createApplication.mutateAsync(data);
      
      toast({
        title: "Demande envoyée avec succès !",
        description: "Nous étudions votre dossier et vous recontacterons sous 48h.",
      });

      // Redirection vers l'espace client
      setTimeout(() => {
        setLocation("/mon-espace/demandes");
      }, 2000);
    } catch (error) {
      toast({
        title: "Erreur lors de l'envoi",
        description: "Une erreur s'est produite. Veuillez réessayer.",
        variant: "destructive",
      });
    }
  };

  if (isLoadingTypes) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        {/* En-tête */}
        <div className="mb-8 text-center">
          <h1 className="text-4xl font-bold mb-4" data-testid="heading-application">
            Demande de Prêt
          </h1>
          <p className="text-xl text-muted-foreground">
            Complétez votre demande en 5 étapes simples
          </p>
        </div>

        {/* Stepper */}
        <div className="mb-8">
          <Stepper
            steps={WIZARD_STEPS}
            currentStep={currentStep}
            onStepClick={canGoToStep(currentStep - 1) ? goToStep : undefined}
          />
        </div>

        {/* Formulaire */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)}>
            <Card>
              <CardHeader>
                <CardTitle data-testid={`title-step-${currentStep}`}>
                  {WIZARD_STEPS[currentStep - 1].label}
                </CardTitle>
                <CardDescription>
                  {WIZARD_STEPS[currentStep - 1].description}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Rendu conditionnel des étapes */}
                {currentStep === 1 && (
                  <StepLoanType
                    form={form}
                    loanTypes={loanTypes || []}
                  />
                )}

                {currentStep === 2 && (
                  <StepSimulation
                    form={form}
                    selectedLoanType={selectedLoanType}
                  />
                )}

                {currentStep === 3 && (
                  <StepInformation
                    form={form}
                  />
                )}

                {currentStep === 4 && (
                  <StepDocuments
                    applicationType={form.watch("applicationType")}
                    onDocumentsUploaded={(hasAll) => setHasAllDocuments(hasAll)}
                  />
                )}

                {currentStep === 5 && (
                  <StepConfirmation
                    form={form}
                    selectedLoanType={selectedLoanType}
                  />
                )}

                {/* Boutons de navigation */}
                <div className="flex items-center justify-between gap-4 pt-6 border-t">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={goToPreviousStep}
                    disabled={isFirstStep}
                    data-testid="button-previous"
                  >
                    <ArrowLeft className="mr-2 h-4 w-4" />
                    Précédent
                  </Button>

                  {!isLastStep ? (
                    <Button
                      type="button"
                      onClick={handleNext}
                      data-testid="button-next"
                    >
                      Suivant
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  ) : (
                    <Button
                      type="submit"
                      disabled={createApplication.isPending}
                      data-testid="button-submit"
                    >
                      {createApplication.isPending ? (
                        <>
                          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                          Envoi en cours...
                        </>
                      ) : (
                        <>
                          <CheckCircle className="mr-2 h-4 w-4" />
                          Envoyer ma demande
                        </>
                      )}
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </form>
        </Form>
      </div>
    </div>
  );
}
