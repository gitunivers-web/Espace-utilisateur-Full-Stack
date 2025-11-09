/**
 * Hook useLoanWizard - Gestion de l'état et de la navigation du wizard de demande de prêt
 * 
 * @hook useLoanWizard
 * @description Hook personnalisé pour orchestrer les étapes du formulaire de demande de prêt.
 * Gère la navigation, la validation, et la persistence de l'état entre les étapes.
 * 
 * @example
 * ```tsx
 * function LoanApplicationWizard() {
 *   const {
 *     currentStep,
 *     isFirstStep,
 *     isLastStep,
 *     goToNextStep,
 *     goToPreviousStep,
 *     goToStep,
 *     canGoToStep
 *   } = useLoanWizard(4);
 * 
 *   return (
 *     <div>
 *       <Stepper currentStep={currentStep} onStepClick={canGoToStep ? goToStep : undefined} />
 *       {currentStep === 1 && <StepOne onNext={goToNextStep} />}
 *       {currentStep === 2 && <StepTwo onNext={goToNextStep} onBack={goToPreviousStep} />}
 *     </div>
 *   );
 * }
 * ```
 * 
 * @features
 * - Navigation entre étapes (suivant, précédent, direct)
 * - Validation avant changement d'étape
 * - État persistant des étapes visitées
 * - Protection contre la navigation vers étapes non-visitées
 */

import { useState, useCallback } from 'react';

export interface UseLoanWizardOptions {
  /** Nombre total d'étapes dans le wizard */
  totalSteps: number;
  /** Étape initiale (par défaut: 1) */
  initialStep?: number;
  /** Callback appelé avant de changer d'étape (pour validation) */
  onStepChange?: (fromStep: number, toStep: number) => boolean | Promise<boolean>;
}

export interface UseLoanWizardReturn {
  /** Numéro de l'étape courante (1-indexed) */
  currentStep: number;
  /** Indique si on est sur la première étape */
  isFirstStep: boolean;
  /** Indique si on est sur la dernière étape */
  isLastStep: boolean;
  /** Ensemble des étapes déjà visitées (pour permettre la navigation arrière) */
  visitedSteps: Set<number>;
  /** Passer à l'étape suivante */
  goToNextStep: () => Promise<void>;
  /** Revenir à l'étape précédente */
  goToPreviousStep: () => void;
  /** Aller directement à une étape spécifique */
  goToStep: (step: number) => void;
  /** Vérifier si on peut naviguer vers une étape spécifique */
  canGoToStep: (step: number) => boolean;
  /** Réinitialiser le wizard à l'étape initiale */
  reset: () => void;
}

/**
 * Hook pour gérer l'état d'un wizard multi-étapes
 * 
 * @param totalSteps - Nombre total d'étapes
 * @param initialStep - Étape de départ (défaut: 1)
 * @param onStepChange - Callback de validation avant changement d'étape
 * @returns Interface de contrôle du wizard
 */
export function useLoanWizard(
  totalSteps: number,
  initialStep: number = 1,
  onStepChange?: (fromStep: number, toStep: number) => boolean | Promise<boolean>
): UseLoanWizardReturn {
  // État de l'étape courante
  const [currentStep, setCurrentStep] = useState(initialStep);
  
  // Ensemble des étapes visitées (permet la navigation vers étapes précédentes)
  const [visitedSteps, setVisitedSteps] = useState<Set<number>>(new Set([initialStep]));

  /**
   * Vérifie si on peut naviguer vers une étape donnée
   * - On peut toujours aller à l'étape suivante immédiate
   * - On peut revenir aux étapes déjà visitées
   * - On ne peut pas sauter des étapes en avant
   */
  const canGoToStep = useCallback((step: number): boolean => {
    if (step < 1 || step > totalSteps) return false;
    if (step === currentStep + 1) return true; // Étape suivante
    if (visitedSteps.has(step)) return true; // Étape déjà visitée
    return false;
  }, [currentStep, totalSteps, visitedSteps]);

  /**
   * Naviguer vers une étape spécifique
   * Ajoute l'étape aux étapes visitées
   */
  const goToStep = useCallback((step: number) => {
    if (!canGoToStep(step)) {
      console.warn(`Cannot navigate to step ${step} from step ${currentStep}`);
      return;
    }

    setCurrentStep(step);
    setVisitedSteps(prev => new Set(Array.from(prev).concat(step)));
  }, [currentStep, canGoToStep]);

  /**
   * Passer à l'étape suivante
   * Exécute le callback de validation si fourni
   */
  const goToNextStep = useCallback(async () => {
    if (currentStep >= totalSteps) {
      console.warn('Already on the last step');
      return;
    }

    const nextStep = currentStep + 1;

    // Validation optionnelle avant changement
    if (onStepChange) {
      const canProceed = await onStepChange(currentStep, nextStep);
      if (!canProceed) {
        return;
      }
    }

    setCurrentStep(nextStep);
    setVisitedSteps(prev => new Set(Array.from(prev).concat(nextStep)));
  }, [currentStep, totalSteps, onStepChange]);

  /**
   * Revenir à l'étape précédente
   * Pas de validation nécessaire pour revenir en arrière
   */
  const goToPreviousStep = useCallback(() => {
    if (currentStep <= 1) {
      console.warn('Already on the first step');
      return;
    }

    setCurrentStep(prev => prev - 1);
  }, [currentStep]);

  /**
   * Réinitialiser le wizard à son état initial
   */
  const reset = useCallback(() => {
    setCurrentStep(initialStep);
    setVisitedSteps(new Set([initialStep]));
  }, [initialStep]);

  return {
    currentStep,
    isFirstStep: currentStep === 1,
    isLastStep: currentStep === totalSteps,
    visitedSteps,
    goToNextStep,
    goToPreviousStep,
    goToStep,
    canGoToStep,
    reset,
  };
}
