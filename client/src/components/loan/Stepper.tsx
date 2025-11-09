/**
 * Composant Stepper - Indicateur visuel d'avancement multi-étapes
 * 
 * @component Stepper
 * @description Affiche une barre de progression avec des étapes numérotées.
 * Utilisé principalement dans le wizard de demande de prêt.
 * 
 * @example
 * ```tsx
 * <Stepper 
 *   steps={[
 *     { id: 1, label: "Type de prêt", description: "Choisissez votre prêt" },
 *     { id: 2, label: "Montant", description: "Simulez votre prêt" },
 *     { id: 3, label: "Informations", description: "Vos informations" },
 *     { id: 4, label: "Confirmation", description: "Vérifiez et envoyez" }
 *   ]}
 *   currentStep={2}
 *   onStepClick={(stepId) => console.log('Navigate to step', stepId)}
 * />
 * ```
 * 
 * @features
 * - Affichage visuel de l'avancement
 * - Support du clic pour navigation (optionnel)
 * - États: completed, current, upcoming
 * - Responsive design
 * - Accessibilité (data-testid)
 */

import { Check } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";

export interface Step {
  /** Identifiant unique de l'étape (1, 2, 3, 4...) */
  id: number;
  /** Libellé court de l'étape */
  label: string;
  /** Description optionnelle de l'étape */
  description?: string;
}

export interface StepperProps {
  /** Liste des étapes à afficher */
  steps: Step[];
  /** Numéro de l'étape courante (1-indexed) */
  currentStep: number;
  /** Callback appelé lors du clic sur une étape (si fourni, les étapes deviennent cliquables) */
  onStepClick?: (stepId: number) => void;
  /** Classe CSS additionnelle pour le conteneur */
  className?: string;
}

/**
 * Determine l'état d'une étape par rapport à l'étape courante
 * @param stepId - L'identifiant de l'étape à évaluer
 * @param currentStep - L'étape courante
 * @returns 'completed' | 'current' | 'upcoming'
 */
function getStepStatus(stepId: number, currentStep: number): 'completed' | 'current' | 'upcoming' {
  if (stepId < currentStep) return 'completed';
  if (stepId === currentStep) return 'current';
  return 'upcoming';
}

export function Stepper({ steps, currentStep, onStepClick, className }: StepperProps) {
  const { t } = useTranslation();
  
  return (
    <nav 
      aria-label={t('stepper.progressLabel')} 
      className={cn("w-full", className)}
      data-testid="stepper"
    >
      <ol className="flex items-center justify-between w-full">
        {steps.map((step, index) => {
          const status = getStepStatus(step.id, currentStep);
          const isClickable = onStepClick && status === 'completed';
          const isLast = index === steps.length - 1;

          return (
            <li 
              key={step.id} 
              className="flex items-center flex-1"
              data-testid={`step-${step.id}`}
            >
              <div className="flex flex-col items-center flex-1">
                {/* Cercle de l'étape */}
                <button
                  type="button"
                  onClick={() => isClickable && onStepClick(step.id)}
                  disabled={!isClickable}
                  className={cn(
                    "relative flex items-center justify-center w-10 h-10 rounded-full transition-colors",
                    "border-2",
                    {
                      // Étape complétée
                      "bg-primary border-primary text-primary-foreground": status === 'completed',
                      // Étape courante
                      "bg-primary/10 border-primary text-primary font-semibold": status === 'current',
                      // Étape à venir
                      "bg-muted border-border text-muted-foreground": status === 'upcoming',
                      // Clickable
                      "cursor-pointer hover-elevate": isClickable,
                      "cursor-default": !isClickable,
                    }
                  )}
                  aria-current={status === 'current' ? 'step' : undefined}
                  aria-label={`${step.id}: ${step.label}${status === 'completed' ? ' ' + t('stepper.completed') : ''}`}
                  data-testid={`step-button-${step.id}`}
                >
                  {status === 'completed' ? (
                    <Check className="w-5 h-5" aria-hidden="true" />
                  ) : (
                    <span className="text-sm font-semibold">{step.id}</span>
                  )}
                </button>

                {/* Label et description */}
                <div className="mt-2 text-center hidden sm:block">
                  <div 
                    className={cn(
                      "text-sm font-medium",
                      {
                        "text-primary": status === 'current' || status === 'completed',
                        "text-muted-foreground": status === 'upcoming',
                      }
                    )}
                    data-testid={`step-label-${step.id}`}
                  >
                    {step.label}
                  </div>
                  {step.description && (
                    <div 
                      className="text-xs text-muted-foreground mt-0.5"
                      data-testid={`step-description-${step.id}`}
                    >
                      {step.description}
                    </div>
                  )}
                </div>
              </div>

              {/* Ligne de connexion entre les étapes */}
              {!isLast && (
                <div 
                  className={cn(
                    "flex-1 h-0.5 mx-2 transition-colors",
                    {
                      "bg-primary": status === 'completed',
                      "bg-border": status !== 'completed',
                    }
                  )}
                  aria-hidden="true"
                  data-testid={`connector-${step.id}`}
                />
              )}
            </li>
          );
        })}
      </ol>

      {/* Affichage mobile simplifié */}
      <div className="sm:hidden mt-4 text-center text-sm text-muted-foreground">
        {t('loanApplication.step')} {currentStep} {t('loanApplication.of')} {steps.length}: {steps.find(s => s.id === currentStep)?.label}
      </div>
    </nav>
  );
}
