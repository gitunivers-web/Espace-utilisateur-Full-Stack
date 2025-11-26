import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { HeroSlider } from "@/components/HeroSlider";
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
  Sparkles,
  TrendingUp,
  Rocket
} from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { t } = useTranslation();

  const heroSlides = [
    {
      id: 1,
      title: "Financement Personnel",
      description: "Réalisez vos projets avec un crédit adapté à votre budget et vos besoins.",
      color: "bg-gradient-to-br from-blue-500 to-blue-600",
      icon: <Sparkles className="w-24 h-24" />,
    },
    {
      id: 2,
      title: "Crédit Professionnel",
      description: "Développez votre activité avec des solutions de financement flexibles.",
      color: "bg-gradient-to-br from-emerald-500 to-emerald-600",
      icon: <TrendingUp className="w-24 h-24" />,
    },
    {
      id: 3,
      title: "Opportunités Illimitées",
      description: "Concrétisez tous vos projets avec nos solutions de financement innovantes.",
      color: "bg-gradient-to-br from-purple-500 to-purple-600",
      icon: <Rocket className="w-24 h-24" />,
    },
  ];

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

  return (
    <div className="overflow-hidden">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-background via-primary/5 to-background pt-16 md:pt-24 pb-12 md:pb-20">
        <div className="absolute inset-0">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        </div>

        <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          {/* Hero Text Content */}
          <div className="max-w-3xl mx-auto text-center mb-12 space-y-6">
            <div className="space-y-4">
              <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight leading-tight">
                {t('home.hero.title')}{" "}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-primary to-accent">
                  {t('home.hero.titleHighlight')}
                </span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
                {t('home.hero.subtitle')}
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link href="/register">
                <Button size="lg" className="gap-2 text-base px-8 py-6" data-testid="button-hero-cta">
                  {t('home.hero.ctaAccount')}
                  <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>
              <Link href="/simulateur">
                <Button size="lg" variant="outline" className="text-base px-8 py-6" data-testid="button-hero-simulator">
                  {t('home.hero.ctaSimulator')}
                </Button>
              </Link>
            </div>

            {/* Key Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8">
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">&lt;48h</div>
                <div className="text-xs md:text-sm text-muted-foreground">{t('home.hero.response')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">97%</div>
                <div className="text-xs md:text-sm text-muted-foreground">{t('home.hero.acceptance')}</div>
              </div>
              <div className="text-center">
                <div className="text-2xl md:text-3xl font-bold text-primary">3,5%</div>
                <div className="text-xs md:text-sm text-muted-foreground">{t('home.hero.rateFrom')}</div>
              </div>
            </div>
          </div>

          {/* Hero Slider */}
          <HeroSlider slides={heroSlides} />
        </div>
      </section>

      {/* How It Works Section */}
      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('home.howItWorks.title')}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('home.howItWorks.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
            {steps.map((step, index) => (
              <div key={index} className="relative">
                <div className="flex flex-col items-center text-center space-y-4">
                  <div className="relative">
                    <div className="h-20 w-20 rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center hover-elevate transition-all">
                      <step.icon className="h-10 w-10 text-primary" />
                    </div>
                    <span className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-primary text-primary-foreground text-sm font-bold flex items-center justify-center">
                      {step.number}
                    </span>
                  </div>
                  <h3 className="text-xl font-semibold">{step.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{step.description}</p>
                </div>
                {index < steps.length - 1 && (
                  <div className="hidden md:block absolute top-10 left-[60%] w-[80%] border-t-2 border-dashed border-primary/30" />
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('home.whyUs.title')}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('home.whyUs.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {benefits.map((benefit, index) => (
              <Card key={index} className="group hover-elevate transition-all duration-300 border-transparent hover:border-primary/20">
                <CardContent className="p-6 text-center space-y-4">
                  <div className="mx-auto h-14 w-14 rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 flex items-center justify-center group-hover:from-primary/20 group-hover:to-accent/20 transition-colors">
                    <benefit.icon className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold">{benefit.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{benefit.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-20 bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('home.testimonials.title')}</h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              {t('home.testimonials.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="relative overflow-visible hover-elevate">
                <CardContent className="p-6 pt-8 space-y-4">
                  <Quote className="absolute -top-4 left-6 h-8 w-8 text-primary/20" />
                  <div className="flex gap-1">
                    {[...Array(testimonial.rating)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-muted-foreground italic leading-relaxed">"{testimonial.text}"</p>
                  <div className="pt-4 border-t">
                    <p className="font-semibold">{testimonial.name}</p>
                    <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary via-primary to-accent">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-primary-foreground mb-4">
            {t('home.cta.title')}
          </h2>
          <p className="text-xl text-primary-foreground/80 mb-8">
            {t('home.cta.subtitle')}
          </p>
          <Link href="/register">
            <Button 
              size="lg" 
              variant="secondary" 
              className="gap-2 text-base px-8 py-6 bg-white text-primary hover:bg-white/90"
              data-testid="button-cta-bottom"
            >
              {t('home.cta.button')}
              <ArrowRight className="h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Legal Section */}
      <section className="py-16 bg-muted/30">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold mb-2">{t('legal.sectionTitle')}</h2>
            <p className="text-muted-foreground">{t('legal.sectionSubtitle')}</p>
          </div>
          
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
