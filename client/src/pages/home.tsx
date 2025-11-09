import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { LoanCard } from "@/components/loan/LoanCard";
import { LoanSimulator } from "@/components/loan/LoanSimulator";
import { LegalDisclaimers, RepresentativeExample } from "@/components/legal/LegalNotice";
import { useLoanTypes } from "@/lib/queries";
import { ArrowRight, Shield, Clock, Check, TrendingUp, FileText, UserCheck, Euro } from "lucide-react";

export default function Home() {
  const { data: loanTypes } = useLoanTypes();
  const featuredLoans = loanTypes?.slice(0, 3);

  return (
    <div>
      <section className="relative bg-gradient-to-b from-primary/10 to-background py-20">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight">
                Financez vos projets en toute{" "}
                <span className="text-primary">simplicité</span>
              </h1>
              <p className="text-xl text-muted-foreground">
                Solutions de financement pour particuliers et professionnels, 
                avec des taux compétitifs dès 3,5% et une réponse rapide
              </p>
              <div className="flex flex-wrap gap-4">
                <Link href="/demande">
                  <Button size="lg" className="gap-2" data-testid="button-hero-cta">
                    Faire une demande
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
                <Link href="/simulateur">
                  <Button size="lg" variant="outline" data-testid="button-hero-simulator">
                    Simuler mon prêt
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-4 pt-8">
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">Réponse</div>
                    <div className="text-sm text-muted-foreground">sous 48h</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <Check className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">97%</div>
                    <div className="text-sm text-muted-foreground">d'acceptation</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <TrendingUp className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">Taux dès</div>
                    <div className="text-sm text-muted-foreground">3,5%</div>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Nos Solutions de Financement</h2>
            <p className="text-xl text-muted-foreground">
              Trouvez le prêt adapté à votre situation
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredLoans?.map((loanType) => (
              <Link key={loanType.id} href={`/demande?type=${loanType.id}`}>
                <LoanCard loanType={loanType} />
              </Link>
            ))}
          </div>

          <div className="text-center mt-8">
            <Link href="/offres">
              <Button variant="outline" size="lg" data-testid="button-view-all-offers">
                Voir toutes nos offres
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-muted/30">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Financement Professionnel</h2>
            <p className="text-xl text-muted-foreground">
              Des solutions adaptées aux TPE, PME et entrepreneurs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
            {[
              {
                title: "Taux moyens 2025",
                value: "3,39%",
                description: "Baisse significative par rapport à 2024",
                icon: TrendingUp,
              },
              {
                title: "Taux d'acceptation",
                value: "97%",
                description: "Pour les crédits d'investissement PME",
                icon: Check,
              },
              {
                title: "Garantie BPI",
                value: "Jusqu'à 90%",
                description: "Facilite l'accès au financement",
                icon: Shield,
              },
              {
                title: "Montants",
                value: "5K€ à 2M€",
                description: "Selon votre projet et profil",
                icon: Euro,
              },
            ].map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center space-y-2">
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <stat.icon className="h-6 w-6 text-primary" />
                  </div>
                  <div className="text-sm text-muted-foreground font-medium">{stat.title}</div>
                  <div className="text-2xl font-bold">{stat.value}</div>
                  <div className="text-xs text-muted-foreground">{stat.description}</div>
                </CardContent>
              </Card>
            ))}
          </div>

          <div className="text-center">
            <Link href="/offres">
              <Button size="lg" data-testid="button-professional-offers">
                Découvrir nos offres professionnelles
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <section className="py-20 bg-card">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Pourquoi Altus Finance ?</h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                title: "Rapide",
                description: "Réponse de principe sous 48h et déblocage des fonds en 72h",
                icon: Clock,
              },
              {
                title: "Transparent",
                description: "Taux et frais clairement affichés, sans surprise",
                icon: Shield,
              },
              {
                title: "Flexible",
                description: "Remboursement anticipé gratuit et report d'échéance possible",
                icon: Check,
              },
              {
                title: "Avantageux",
                description: "Taux compétitifs et conditions négociées",
                icon: TrendingUp,
              },
            ].map((feature, index) => (
              <Card key={index}>
                <CardContent className="p-6 text-center space-y-4">
                  <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <feature.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="text-xl font-semibold">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
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
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Informations Légales</h2>
              <p className="text-xl text-muted-foreground">
                Transparence et conformité pour votre tranquillité d'esprit
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
