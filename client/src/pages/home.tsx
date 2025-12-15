import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { ScrollAnimatedElement } from "@/components/ScrollAnimatedElement";
import { LegalDisclaimers, RepresentativeExample } from "@/components/legal/LegalNotice";
import { 
  ArrowRight, 
  Shield, 
  Clock, 
  Zap, 
  HeadphonesIcon,
  FileText, 
  CheckCircle2, 
  Banknote,
  Star,
  Quote,
  Lock,
  Scale
} from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  const steps = [
    {
      icon: FileText,
      title: t('home.howItWorks.step1Title'),
      description: t('home.howItWorks.step1Desc'),
      number: "01"
    },
    {
      icon: Zap,
      title: t('home.howItWorks.step2Title'),
      description: t('home.howItWorks.step2Desc'),
      number: "02"
    },
    {
      icon: Banknote,
      title: t('home.howItWorks.step3Title'),
      description: t('home.howItWorks.step3Desc'),
      number: "03"
    }
  ];

  const benefits = [
    {
      icon: Shield,
      title: t('home.whyUs.security'),
      description: t('home.whyUs.securityDesc')
    },
    {
      icon: Clock,
      title: t('home.whyUs.speed'),
      description: t('home.whyUs.speedDesc')
    },
    {
      icon: CheckCircle2,
      title: t('home.whyUs.flexibility'),
      description: t('home.whyUs.flexibilityDesc')
    },
    {
      icon: HeadphonesIcon,
      title: t('home.whyUs.support'),
      description: t('home.whyUs.supportDesc')
    }
  ];

  const testimonials = [
    {
      name: t('home.testimonials.testimonial1.name'),
      role: t('home.testimonials.testimonial1.role'),
      text: t('home.testimonials.testimonial1.text'),
      rating: 5
    },
    {
      name: t('home.testimonials.testimonial2.name'),
      role: t('home.testimonials.testimonial2.role'),
      text: t('home.testimonials.testimonial2.text'),
      rating: 5
    },
    {
      name: t('home.testimonials.testimonial3.name'),
      role: t('home.testimonials.testimonial3.role'),
      text: t('home.testimonials.testimonial3.text'),
      rating: 5
    }
  ];

  const trustIndicators = [
    { icon: Clock, label: "Réponse sous 48h", sublabel: "Traitement rapide" },
    { icon: CheckCircle2, label: "Taux transparents", sublabel: "Sans frais cachés" },
    { icon: Lock, label: "Données sécurisées", sublabel: "Chiffrement SSL" },
    { icon: Scale, label: "Conforme RGPD", sublabel: "Réglementation EU" }
  ];

  return (
    <div className="overflow-hidden">
      {/* Premium Hero Section - Clean White Design */}
      <section className="relative bg-background pt-12 md:pt-20 pb-16 md:pb-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Column - Content */}
            <div className="space-y-8">
              <div className="space-y-6">
                <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight leading-[1.1]">
                  <span className="text-foreground">{t('home.hero.title')}</span>{" "}
                  <span className="text-accent">
                    {t('home.hero.titleHighlight')}
                  </span>
                </h1>
                <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                  {t('home.hero.subtitle')}
                </p>
              </div>

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/register">
                  <Button size="lg" className="gap-2 text-base px-8" data-testid="button-hero-cta">
                    {t('home.hero.ctaAccount')}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/simulateur">
                  <Button size="lg" variant="outline" className="text-base px-8" data-testid="button-hero-simulator">
                    {t('home.hero.ctaSimulator')}
                  </Button>
                </Link>
              </div>

              {/* Key Stats - Clean Design */}
              <div className="flex flex-wrap gap-8 pt-4">
                <div data-testid="stat-response-time">
                  <div className="text-3xl font-bold text-accent">&lt;48h</div>
                  <div className="text-sm text-muted-foreground">{t('home.hero.response')}</div>
                </div>
                <div data-testid="stat-acceptance-rate">
                  <div className="text-3xl font-bold text-accent">97%</div>
                  <div className="text-sm text-muted-foreground">{t('home.hero.acceptance')}</div>
                </div>
                <div data-testid="stat-rate-from">
                  <div className="text-3xl font-bold text-accent">3,5%</div>
                  <div className="text-sm text-muted-foreground">{t('home.hero.rateFrom')}</div>
                </div>
              </div>
            </div>

            {/* Right Column - Modern Dashboard Mockup */}
            <div className="hidden md:block">
              <div className="relative">
                {/* Main Dashboard Card */}
                <div className="bg-card rounded-2xl border shadow-lg p-6 space-y-6">
                  {/* Dashboard Header */}
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-muted-foreground">Votre financement</p>
                      <p className="text-2xl font-bold">25 000 €</p>
                    </div>
                    <div className="h-12 w-12 rounded-full bg-accent/10 flex items-center justify-center">
                      <CheckCircle2 className="h-6 w-6 text-accent" />
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="text-muted-foreground">Progression</span>
                      <span className="font-medium">75%</span>
                    </div>
                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-accent rounded-full" />
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-muted/50 rounded-xl p-4">
                      <p className="text-xs text-muted-foreground">Taux TAEG</p>
                      <p className="text-lg font-semibold">3,5%</p>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-4">
                      <p className="text-xs text-muted-foreground">Durée</p>
                      <p className="text-lg font-semibold">48 mois</p>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-4">
                      <p className="text-xs text-muted-foreground">Mensualité</p>
                      <p className="text-lg font-semibold">559 €</p>
                    </div>
                    <div className="bg-muted/50 rounded-xl p-4">
                      <p className="text-xs text-muted-foreground">Statut</p>
                      <p className="text-lg font-semibold text-accent">Approuvé</p>
                    </div>
                  </div>
                </div>

                {/* Floating Card - Bottom Right */}
                <div className="absolute -bottom-6 -right-6 bg-accent text-accent-foreground rounded-xl p-4 shadow-lg">
                  <div className="flex items-center gap-3">
                    <div className="h-10 w-10 rounded-full bg-white/20 flex items-center justify-center">
                      <Zap className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-sm font-medium">Réponse rapide</p>
                      <p className="text-xs opacity-80">Sous 48 heures</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Indicators Bar */}
      <section className="border-y bg-muted/30" data-testid="section-trust-indicators">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
            {trustIndicators.map((item, index) => (
              <div key={index} className="flex items-center gap-3" data-testid={`trust-indicator-${index}`}>
                <div className="h-10 w-10 rounded-lg bg-accent/10 flex items-center justify-center flex-shrink-0">
                  <item.icon className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">{item.label}</p>
                  <p className="text-xs text-muted-foreground">{item.sublabel}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 md:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollAnimatedElement direction="up" duration={0.8} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('home.howItWorks.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('home.howItWorks.subtitle')}
            </p>
          </ScrollAnimatedElement>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <ScrollAnimatedElement
                key={index}
                direction={index % 2 === 0 ? "left" : "right"}
                duration={0.8}
                delay={index * 0.15}
              >
                <div className="relative text-center">
                  <div className="inline-flex flex-col items-center space-y-4">
                    <div className="relative">
                      <div className="h-16 w-16 rounded-2xl bg-muted flex items-center justify-center">
                        <step.icon className="h-8 w-8 text-foreground" />
                      </div>
                      <span className="absolute -top-2 -right-2 h-7 w-7 rounded-full bg-accent text-accent-foreground text-xs font-bold flex items-center justify-center">
                        {step.number}
                      </span>
                    </div>
                    <h3 className="text-xl font-semibold">{step.title}</h3>
                    <p className="text-muted-foreground leading-relaxed max-w-sm">{step.description}</p>
                  </div>
                  {index < steps.length - 1 && (
                    <div className="hidden md:block absolute top-8 left-[60%] w-[80%] border-t-2 border-dashed border-border" />
                  )}
                </div>
              </ScrollAnimatedElement>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 md:py-24 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollAnimatedElement direction="up" duration={0.8} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('home.whyUs.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('home.whyUs.subtitle')}
            </p>
          </ScrollAnimatedElement>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <ScrollAnimatedElement
                key={index}
                direction={index % 2 === 0 ? "left" : "right"}
                duration={0.8}
                delay={index * 0.1}
              >
                <Card className="h-full border-transparent bg-card shadow-sm hover:shadow-md transition-shadow duration-300">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="mx-auto h-12 w-12 rounded-xl bg-accent/10 flex items-center justify-center">
                      <benefit.icon className="h-6 w-6 text-accent" />
                    </div>
                    <h3 className="text-lg font-semibold">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
                  </CardContent>
                </Card>
              </ScrollAnimatedElement>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 md:py-24 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <ScrollAnimatedElement direction="up" duration={0.8} className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('home.testimonials.title')}</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              {t('home.testimonials.subtitle')}
            </p>
          </ScrollAnimatedElement>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((testimonial, index) => (
              <ScrollAnimatedElement
                key={index}
                direction={index === 0 ? "left" : index === 2 ? "right" : "up"}
                duration={0.8}
                delay={index * 0.15}
              >
                <Card className="relative h-full bg-card shadow-sm">
                  <CardContent className="p-6 pt-8 space-y-4">
                    <Quote className="absolute top-4 left-6 h-6 w-6 text-accent/30" />
                    <div className="flex gap-1">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-4 w-4 fill-accent text-accent" />
                      ))}
                    </div>
                    <p className="text-muted-foreground leading-relaxed">"{testimonial.text}"</p>
                    <div className="pt-4 border-t border-border">
                      <p className="font-semibold">{testimonial.name}</p>
                      <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                    </div>
                  </CardContent>
                </Card>
              </ScrollAnimatedElement>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-24 bg-foreground">
        <ScrollAnimatedElement direction="up" duration={0.8}>
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-3xl md:text-4xl font-bold text-background mb-4">
              {t('home.cta.title')}
            </h2>
            <p className="text-lg text-background/70 mb-8">
              {t('home.cta.subtitle')}
            </p>
            <Link href="/register">
              <Button 
                size="lg" 
                className="gap-2 text-base px-8 bg-background text-foreground hover:bg-background/90"
                data-testid="button-cta-bottom"
              >
                {t('home.cta.button')}
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </ScrollAnimatedElement>
      </section>

      {/* Legal Section */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <ScrollAnimatedElement direction="up" duration={0.8} className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">{t('legal.sectionTitle')}</h2>
            <p className="text-muted-foreground">{t('legal.sectionSubtitle')}</p>
          </ScrollAnimatedElement>
          
          <div className="space-y-6">
            <RepresentativeExample
              amount={10000}
              durationMonths={36}
              taeg={4.5}
              monthlyPayment={296}
              totalCost={10656}
              interestType="fixe"
            />
            
            <LegalDisclaimers />
          </div>
        </div>
      </section>
    </div>
  );
}
