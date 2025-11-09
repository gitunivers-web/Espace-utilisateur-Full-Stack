/**
 * Page "Comment ça marche" - Explique le processus de demande de prêt
 * 
 * @component HowItWorks
 * @description Page publique détaillant les 4 étapes du processus de demande de prêt chez Altus Finance.
 * Comprend une timeline visuelle, les avantages clés, et des CTA pour démarrer une demande.
 * 
 * @section SEO
 * - Title: Comment obtenir un prêt | Altus Finance
 * - Description: Découvrez comment obtenir un prêt en 4 étapes simples avec Altus Finance
 * 
 * @section Sections
 * 1. Hero - Titre et description du processus
 * 2. Timeline - 4 étapes visuelles du processus
 * 3. Avantages - Pourquoi choisir Altus Finance
 * 4. CTA - Appel à l'action pour démarrer une demande
 * 
 * @route /comment-ca-marche
 * @layout PublicLayout
 */

import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { 
  Search, 
  FileText, 
  CheckCircle, 
  CreditCard,
  ArrowRight,
  Clock,
  Shield,
  Smartphone,
  HeadphonesIcon
} from "lucide-react";
import { useEffect } from "react";

/**
 * Étapes du processus de demande de prêt
 * Chaque étape contient un icône, un titre, une description et une durée estimée
 */
const PROCESS_STEPS = [
  {
    icon: Search,
    title: "1. Simulez votre prêt",
    description: "Utilisez notre simulateur en ligne pour estimer vos mensualités et trouver l'offre adaptée à votre budget.",
    duration: "2 min",
    color: "text-blue-500",
    bgColor: "bg-blue-500/10",
  },
  {
    icon: Smartphone,
    title: "2. Inscrivez-vous en quelques clics",
    description: "Créez votre compte en quelques secondes pour accéder à votre espace personnel sécurisé et soumettre votre demande de prêt.",
    duration: "1 min",
    color: "text-purple-500",
    bgColor: "bg-purple-500/10",
  },
  {
    icon: FileText,
    title: "3. Complétez votre demande depuis Mon Espace",
    description: "Connectez-vous à votre tableau de bord et remplissez le formulaire de demande avec vos informations. Tout se fait 100% en ligne.",
    duration: "10 min",
    color: "text-indigo-500",
    bgColor: "bg-indigo-500/10",
  },
  {
    icon: CheckCircle,
    title: "4. Recevez une réponse rapide",
    description: "Notre équipe analyse votre demande et vous donne une réponse de principe sous 48h. Suivez l'avancement en temps réel dans votre espace.",
    duration: "48h",
    color: "text-amber-500",
    bgColor: "bg-amber-500/10",
  },
];

/**
 * Avantages clés de la plateforme
 */
const KEY_BENEFITS = [
  {
    icon: Clock,
    title: "Rapide et efficace",
    description: "Réponse sous 48h et déblocage en 72h",
  },
  {
    icon: Shield,
    title: "100% sécurisé",
    description: "Vos données sont protégées et chiffrées",
  },
  {
    icon: Smartphone,
    title: "100% en ligne",
    description: "Pas de déplacement nécessaire",
  },
  {
    icon: HeadphonesIcon,
    title: "Accompagnement personnalisé",
    description: "Une équipe dédiée pour vous conseiller",
  },
];

export default function HowItWorks() {
  /**
   * Mise à jour du title et meta description pour le SEO
   */
  useEffect(() => {
    document.title = "Comment obtenir un prêt | Altus Finance";
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        "Découvrez comment obtenir un prêt en 4 étapes simples avec Altus Finance. Simulation gratuite, réponse rapide sous 48h, déblocage des fonds en 72h."
      );
    }
  }, []);

  return (
    <div className="pb-12">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            <h1 
              className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight"
              data-testid="heading-main"
            >
              Comment obtenir votre prêt en{" "}
              <span className="text-primary">4 étapes simples</span>
            </h1>
            <p className="text-xl text-muted-foreground" data-testid="text-description">
              Un processus 100% en ligne, rapide et transparent pour financer vos projets
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Section - Processus en 4 étapes */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-8">
            {PROCESS_STEPS.map((step, index) => (
              <Card 
                key={index} 
                className="hover-elevate"
                data-testid={`card-step-${index + 1}`}
              >
                <CardContent className="p-6 space-y-4">
                  <div className="flex items-start gap-4">
                    <div 
                      className={`h-14 w-14 rounded-md ${step.bgColor} flex items-center justify-center flex-shrink-0`}
                      data-testid={`icon-step-${index + 1}`}
                    >
                      <step.icon className={`h-7 w-7 ${step.color}`} />
                    </div>
                    <div className="flex-1 space-y-2">
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <h3 
                          className="text-xl font-semibold"
                          data-testid={`heading-step-${index + 1}`}
                        >
                          {step.title}
                        </h3>
                        <span 
                          className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full"
                          data-testid={`badge-duration-${index + 1}`}
                        >
                          {step.duration}
                        </span>
                      </div>
                      <p 
                        className="text-muted-foreground"
                        data-testid={`text-step-${index + 1}`}
                      >
                        {step.description}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* CTA après les étapes */}
          <div className="mt-12 text-center">
            <Link href="/auth/connexion">
              <Button 
                size="lg" 
                className="gap-2"
                data-testid="button-start-application"
              >
                Créer mon compte et commencer
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Avantages Section */}
      <section className="py-20 bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              data-testid="heading-benefits"
            >
              Pourquoi choisir Altus Finance ?
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Une plateforme moderne pensée pour vous simplifier l'accès au financement
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {KEY_BENEFITS.map((benefit, index) => (
              <div 
                key={index} 
                className="text-center space-y-4"
                data-testid={`benefit-${index + 1}`}
              >
                <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <benefit.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{benefit.title}</h3>
                <p className="text-sm text-muted-foreground">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Section FAQ simplifiée */}
      <section className="py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 
              className="text-3xl md:text-4xl font-bold mb-4"
              data-testid="heading-faq"
            >
              Questions fréquentes
            </h2>
          </div>

          <div className="space-y-6">
            {[
              {
                question: "Quels documents sont nécessaires ?",
                answer: "Pour une demande de prêt, vous aurez besoin d'une pièce d'identité, d'un justificatif de domicile récent, et de vos 3 derniers bulletins de salaire (ou justificatif de revenus pour les professionnels)."
              },
              {
                question: "Puis-je rembourser par anticipation ?",
                answer: "Oui, le remboursement anticipé est gratuit chez Altus Finance. Vous pouvez rembourser tout ou partie de votre prêt à tout moment sans frais supplémentaires."
              },
              {
                question: "Quel est le taux d'acceptation ?",
                answer: "Notre taux d'acceptation varie selon les profils, mais nous étudions chaque dossier avec attention. Même si vous avez été refusé ailleurs, n'hésitez pas à faire une simulation."
              },
              {
                question: "Comment suivre ma demande ?",
                answer: "Une fois votre demande soumise, vous pouvez suivre son avancement en temps réel dans votre espace client 'Mon Espace'. Vous recevrez également des notifications par email à chaque étape."
              },
            ].map((faq, index) => (
              <Card key={index} data-testid={`faq-${index + 1}`}>
                <CardContent className="p-6 space-y-2">
                  <h3 className="text-lg font-semibold">{faq.question}</h3>
                  <p className="text-muted-foreground">{faq.answer}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Final */}
      <section className="py-20 bg-gradient-to-b from-primary/10 to-background">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 
            className="text-3xl md:text-4xl font-bold"
            data-testid="heading-cta"
          >
            Prêt à démarrer votre projet ?
          </h2>
          <p className="text-xl text-muted-foreground">
            Obtenez une réponse de principe en 48h
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/simulateur">
              <Button 
                size="lg" 
                variant="outline"
                data-testid="button-simulate"
              >
                Simuler mon prêt
              </Button>
            </Link>
            <Link href="/auth/connexion">
              <Button 
                size="lg" 
                className="gap-2"
                data-testid="button-apply"
              >
                Créer mon compte
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
