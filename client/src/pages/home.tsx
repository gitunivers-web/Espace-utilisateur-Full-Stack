import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoanCard } from "@/components/loan/LoanCard";
import { LoanSimulator } from "@/components/loan/LoanSimulator";
import { LegalDisclaimers, RepresentativeExample } from "@/components/legal/LegalNotice";
import { useLoanTypes } from "@/lib/queries";
import { ArrowRight, Shield, Clock, Check, TrendingUp, Star, Euro } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function Home() {
  const { data: loanTypes } = useLoanTypes();
  const featuredLoans = loanTypes?.slice(0, 3);
  const { t } = useTranslation();

  return (
    <div>
      <section className="relative bg-background py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-8">
            <div className="space-y-4 max-w-3xl mx-auto">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                {t('home.hero.title')}{" "}
                <span className="text-primary block mt-2">{t('home.hero.titleHighlight')}</span>
              </h1>
              <p className="text-lg md:text-xl text-muted-foreground">
                {t('home.hero.subtitle')}
              </p>
            </div>
            
            <div className="flex flex-wrap gap-3 justify-center">
              <Link href="/auth/connexion">
                <Button size="lg" className="gap-2 min-w-[200px]" data-testid="button-hero-cta">
                  {t('home.hero.ctaAccount')}
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/simulateur">
                <Button size="lg" variant="outline" className="min-w-[200px]" data-testid="button-hero-simulator">
                  {t('home.hero.ctaSimulator')}
                </Button>
              </Link>
            </div>

            <div className="pt-8 max-w-2xl mx-auto">
              <LoanSimulator />
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/30">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 mb-2">
              <div className="flex">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-6 w-6 fill-primary text-primary" />
                ))}
              </div>
              <span className="text-2xl font-bold">4.8/5</span>
            </div>
            <p className="text-muted-foreground">{t('home.testimonials.basedOn')}</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
            <div className="bg-background p-6 rounded-lg">
              <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
              <div className="font-semibold">{t('home.hero.response')}</div>
              <div className="text-sm text-muted-foreground mt-1">{t('home.hero.responseTime')}</div>
            </div>
            <div className="bg-background p-6 rounded-lg">
              <Shield className="h-8 w-8 text-primary mx-auto mb-3" />
              <div className="font-semibold">100% digital</div>
              <div className="text-sm text-muted-foreground mt-1">Sans frais de dossier</div>
            </div>
            <div className="bg-background p-6 rounded-lg">
              <TrendingUp className="h-8 w-8 text-primary mx-auto mb-3" />
              <div className="font-semibold">{t('home.hero.rateFrom')}</div>
              <div className="text-sm text-muted-foreground mt-1">{t('home.hero.rateValue')}</div>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 md:py-20 bg-background">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-3">{t('home.solutions.title')}</h2>
            <p className="text-lg text-muted-foreground">
              {t('home.solutions.subtitle')}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {featuredLoans?.map((loanType) => (
              <Link key={loanType.id} href={`/auth/connexion?redirect=/mon-espace&loanType=${loanType.id}`}>
                <LoanCard loanType={loanType} />
              </Link>
            ))}
          </div>

          <div className="text-center">
            <Link href="/offres">
              <Button variant="outline" size="lg" data-testid="button-view-all-offers">
                {t('home.solutions.viewAll')}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-16 bg-background">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold mb-3">{t('home.whyUs.title')}</h2>
            <p className="text-muted-foreground">Des solutions adaptées à tous vos projets</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <Clock className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">{t('home.whyUs.fast')}</h3>
              <p className="text-sm text-muted-foreground">{t('home.whyUs.fastDesc')}</p>
            </div>
            <div className="text-center">
              <Shield className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">{t('home.whyUs.transparent')}</h3>
              <p className="text-sm text-muted-foreground">{t('home.whyUs.transparentDesc')}</p>
            </div>
            <div className="text-center">
              <Check className="h-10 w-10 text-primary mx-auto mb-4" />
              <h3 className="font-semibold mb-2">{t('home.whyUs.flexible')}</h3>
              <p className="text-sm text-muted-foreground">{t('home.whyUs.flexibleDesc')}</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-muted/20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
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
