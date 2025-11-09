import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoanCard } from "@/components/loan/LoanCard";
import { LoanSimulator } from "@/components/loan/LoanSimulator";
import { LegalDisclaimers, RepresentativeExample } from "@/components/legal/LegalNotice";
import { useLoanTypes } from "@/lib/queries";
import { ArrowRight, Shield, Clock, Check, TrendingUp, FileText, UserCheck, Euro } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { data: loanTypes } = useLoanTypes();
  const featuredLoans = loanTypes?.slice(0, 3);
  const { t } = useTranslation();

  return (
    <div>
      <section className="relative bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                {t('home.hero.title')}{" "}
                <span className="text-primary">{t('home.hero.titleHighlight')}</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                {t('home.hero.subtitle')}
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/auth/connexion">
                  <Button size="lg" className="gap-2" data-testid="button-hero-cta">
                    {t('home.hero.ctaAccount')}
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/simulateur">
                  <Button size="lg" variant="outline" data-testid="button-hero-simulator">
                    {t('home.hero.ctaSimulator')}
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-8">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">{t('home.hero.response')}</div>
                    <div className="text-sm text-muted-foreground">{t('home.hero.responseTime')}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">{t('home.hero.acceptanceValue')}</div>
                    <div className="text-sm text-muted-foreground">{t('home.hero.acceptance')}</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">{t('home.hero.rateFrom')}</div>
                    <div className="text-sm text-muted-foreground">{t('home.hero.rateValue')}</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <LoanSimulator />
            </div>
          </div>
        </div>
      </section>

      <section className="py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('home.solutions.title')}</h2>
            <p className="text-xl text-muted-foreground">
              {t('home.solutions.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredLoans?.map((loanType) => (
              <Link key={loanType.id} href={`/auth/connexion?redirect=/mon-espace&loanType=${loanType.id}`}>
                <LoanCard loanType={loanType} />
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/offres">
              <Button variant="outline" size="lg" data-testid="button-view-all-offers">
                {t('home.solutions.viewAll')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('home.professional.title')}</h2>
            <p className="text-xl text-muted-foreground">
              {t('home.professional.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                titleKey: "home.professional.avgRates",
                valueKey: "home.professional.avgRatesValue",
                descriptionKey: "home.professional.avgRatesDesc",
                icon: TrendingUp,
              },
              {
                titleKey: "home.professional.acceptanceRate",
                valueKey: "home.professional.acceptanceRateValue",
                descriptionKey: "home.professional.acceptanceRateDesc",
                icon: Check,
              },
              {
                titleKey: "home.professional.bpiGuarantee",
                valueKey: "home.professional.bpiGuaranteeValue",
                descriptionKey: "home.professional.bpiGuaranteeDesc",
                icon: Shield,
              },
              {
                titleKey: "home.professional.amounts",
                valueKey: "home.professional.amountsValue",
                descriptionKey: "home.professional.amountsDesc",
                icon: Euro,
              },
            ].map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center space-y-2">
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">{t(stat.titleKey)}</div>
                  <div className="text-2xl font-bold">{t(stat.valueKey)}</div>
                  <div className="text-xs text-muted-foreground">{t(stat.descriptionKey)}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link href="/offres">
              <Button size="lg" data-testid="button-professional-offers">
                {t('home.professional.discoverOffers')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('home.whyUs.title')}</h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                titleKey: "home.whyUs.fast",
                descriptionKey: "home.whyUs.fastDesc",
                icon: Clock,
              },
              {
                titleKey: "home.whyUs.transparent",
                descriptionKey: "home.whyUs.transparentDesc",
                icon: Shield,
              },
              {
                titleKey: "home.whyUs.flexible",
                descriptionKey: "home.whyUs.flexibleDesc",
                icon: Check,
              },
              {
                titleKey: "home.whyUs.advantageous",
                descriptionKey: "home.whyUs.advantageousDesc",
                icon: TrendingUp,
              },
            ].map((feature, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center space-y-4">
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{t(feature.titleKey)}</h3>
                  <p className="text-muted-foreground">{t(feature.descriptionKey)}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 bg-background">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="max-w-4xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('legal.sectionTitle')}</h2>
              <p className="text-xl text-muted-foreground">
                {t('legal.sectionSubtitle')}
              </p>
            </div>
            
            <div className="space-y-8">
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
        </div>
      </section>
    </div>
  );
}
