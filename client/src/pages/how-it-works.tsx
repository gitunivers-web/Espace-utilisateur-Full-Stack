/**
 * Page "Comment ça marche" - Explique le processus de demande de prêt
 * 
 * @component HowItWorks
 * @description Page publique détaillant les 4 étapes du processus de demande de prêt chez Lendia.
 * Comprend une timeline visuelle, les avantages clés, et des CTA pour démarrer une demande.
 * 
 * @section SEO
 * - Title: Comment obtenir un prêt | Lendia
 * - Description: Découvrez comment obtenir un prêt en 4 étapes simples avec Lendia
 * 
 * @section Sections
 * 1. Hero - Titre et description du processus
 * 2. Timeline - 4 étapes visuelles du processus
 * 3. Avantages - Pourquoi choisir Lendia
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
import { useTranslation } from 'react-i18next';

export default function HowItWorks() {
  const { t } = useTranslation();

  /**
   * Étapes du processus de demande de prêt
   * Chaque étape contient un icône, un titre, une description et une durée estimée
   */
  const processSteps = [
    {
      icon: Search,
      titleKey: "howItWorks.step1Title",
      descriptionKey: "howItWorks.step1Desc",
      durationKey: "howItWorks.step1Duration",
      color: "text-blue-500",
      bgColor: "bg-blue-500/10",
    },
    {
      icon: Smartphone,
      titleKey: "howItWorks.step2Title",
      descriptionKey: "howItWorks.step2Desc",
      durationKey: "howItWorks.step2Duration",
      color: "text-purple-500",
      bgColor: "bg-purple-500/10",
    },
    {
      icon: FileText,
      titleKey: "howItWorks.step3Title",
      descriptionKey: "howItWorks.step3Desc",
      durationKey: "howItWorks.step3Duration",
      color: "text-indigo-500",
      bgColor: "bg-indigo-500/10",
    },
    {
      icon: CheckCircle,
      titleKey: "howItWorks.step4Title",
      descriptionKey: "howItWorks.step4Desc",
      durationKey: "howItWorks.step4Duration",
      color: "text-amber-500",
      bgColor: "bg-amber-500/10",
    },
  ];

  /**
   * Avantages clés de la plateforme
   */
  const keyBenefits = [
    {
      icon: Clock,
      titleKey: "howItWorks.fast",
      descriptionKey: "howItWorks.fastDesc",
    },
    {
      icon: Shield,
      titleKey: "howItWorks.secure",
      descriptionKey: "howItWorks.secureDesc",
    },
    {
      icon: Smartphone,
      titleKey: "howItWorks.online",
      descriptionKey: "howItWorks.onlineDesc",
    },
    {
      icon: HeadphonesIcon,
      titleKey: "howItWorks.personalized",
      descriptionKey: "howItWorks.personalizedDesc",
    },
  ];

  const faqs = [
    {
      questionKey: "howItWorks.faqQ1",
      answerKey: "howItWorks.faqA1"
    },
    {
      questionKey: "howItWorks.faqQ2",
      answerKey: "howItWorks.faqA2"
    },
    {
      questionKey: "howItWorks.faqQ3",
      answerKey: "howItWorks.faqA3"
    },
    {
      questionKey: "howItWorks.faqQ4",
      answerKey: "howItWorks.faqA4"
    },
  ];

  /**
   * Mise à jour du title et meta description pour le SEO
   */
  useEffect(() => {
    document.title = t('howItWorks.pageTitle');
    
    const metaDescription = document.querySelector('meta[name="description"]');
    if (metaDescription) {
      metaDescription.setAttribute(
        "content",
        t('howItWorks.pageDescription')
      );
    }
  }, [t]);

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
              {t('howItWorks.title')}{" "}
              <span className="text-primary">{t('howItWorks.titleHighlight')}</span>
            </h1>
            <p className="text-xl text-muted-foreground" data-testid="text-description">
              {t('howItWorks.subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Timeline Section - Processus en 4 étapes */}
      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {processSteps.map((step, index) => (
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
                          {t(step.titleKey)}
                        </h3>
                        <span 
                          className="text-sm font-medium text-primary bg-primary/10 px-3 py-1 rounded-full"
                          data-testid={`badge-duration-${index + 1}`}
                        >
                          {t(step.durationKey)}
                        </span>
                      </div>
                      <p 
                        className="text-muted-foreground"
                        data-testid={`text-step-${index + 1}`}
                      >
                        {t(step.descriptionKey)}
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
                {t('howItWorks.startCta')}
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
              {t('howItWorks.whyUs')}
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('howItWorks.whyUsSubtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {keyBenefits.map((benefit, index) => (
              <div 
                key={index} 
                className="text-center space-y-4"
                data-testid={`benefit-${index + 1}`}
              >
                <div className="mx-auto h-14 w-14 rounded-full bg-primary/10 flex items-center justify-center">
                  <benefit.icon className="h-7 w-7 text-primary" />
                </div>
                <h3 className="text-lg font-semibold">{t(benefit.titleKey)}</h3>
                <p className="text-sm text-muted-foreground">{t(benefit.descriptionKey)}</p>
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
              {t('howItWorks.faq')}
            </h2>
          </div>

          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <Card key={index} data-testid={`faq-${index + 1}`}>
                <CardContent className="p-6 space-y-2">
                  <h3 className="text-lg font-semibold">{t(faq.questionKey)}</h3>
                  <p className="text-muted-foreground">{t(faq.answerKey)}</p>
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
            {t('howItWorks.readyTitle')}
          </h2>
          <p className="text-xl text-muted-foreground">
            {t('howItWorks.readySubtitle')}
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/simulateur">
              <Button 
                size="lg" 
                variant="outline"
                data-testid="button-simulate"
              >
                {t('howItWorks.simulateCta')}
              </Button>
            </Link>
            <Link href="/auth/connexion">
              <Button 
                size="lg" 
                className="gap-2"
                data-testid="button-apply"
              >
                {t('howItWorks.createAccountCta')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
