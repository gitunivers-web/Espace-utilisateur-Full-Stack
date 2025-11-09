import { Card, CardContent } from "@/components/ui/card";
import { Shield, Users, Award, TrendingUp, Building, MapPin, Mail, Phone } from "lucide-react";

export default function About() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">À Propos d'Altus Finance</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            Votre partenaire de confiance pour tous vos projets de financement depuis 2020
          </p>
        </div>

        <div className="prose max-w-none mb-12">
          <p className="text-lg text-muted-foreground">
            Altus Finance Group est une plateforme de financement en ligne spécialisée dans les prêts
            personnels et professionnels. Notre mission est de rendre l'accès au crédit simple, rapide
            et transparent pour tous.
          </p>
          <p className="text-lg text-muted-foreground mt-4">
            Fondée en 2020, notre entreprise a pour ambition de démocratiser l'accès au financement grâce 
            à la technologie et une approche centrée sur le client. Nous croyons que chaque projet mérite 
            d'être soutenu, et c'est pourquoi nous proposons des solutions de financement adaptées aussi 
            bien aux particuliers qu'aux professionnels.
          </p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {[
            {
              title: "Sécurité",
              description: "Données protégées et transactions sécurisées",
              icon: Shield,
            },
            {
              title: "+10 000 clients",
              description: "Nous accompagnent chaque année",
              icon: Users,
            },
            {
              title: "Expertise",
              description: "Une équipe de professionnels à votre écoute",
              icon: Award,
            },
            {
              title: "Innovation",
              description: "Technologie de pointe pour votre confort",
              icon: TrendingUp,
            },
          ].map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{stat.title}</h3>
                <p className="text-muted-foreground">{stat.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-12">
          <div>
            <h2 className="text-2xl font-bold mb-4">Notre Engagement</h2>
            <p className="text-muted-foreground">
              Chez Altus Finance, nous nous engageons à offrir un service de qualité basé sur la
              transparence, la réactivité et l'accompagnement personnalisé. Chaque demande est étudiée
              avec soin par nos experts pour vous proposer la meilleure solution de financement.
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Nos Valeurs</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>• <strong>Transparence</strong> : Des taux et conditions clairement affichés, sans frais cachés</li>
              <li>• <strong>Rapidité</strong> : Une réponse de principe sous 48h et déblocage en 72h</li>
              <li>• <strong>Accompagnement</strong> : Une équipe dédiée pour vous conseiller à chaque étape</li>
              <li>• <strong>Flexibilité</strong> : Des solutions adaptées à votre situation personnelle ou professionnelle</li>
              <li>• <strong>Innovation</strong> : Une plateforme 100% en ligne pour simplifier vos démarches</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">Informations Légales</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <Building className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold mb-1">Raison Sociale</div>
                      <div className="text-sm text-muted-foreground">
                        Altus Finance Group SAS
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold mb-1">Siège Social</div>
                      <div className="text-sm text-muted-foreground">
                        123 Avenue des Champs-Élysées<br />
                        75008 Paris, France
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Building className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold mb-1">SIREN / SIRET</div>
                      <div className="text-sm text-muted-foreground">
                        123 456 789 00012
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold mb-1">Capital Social</div>
                      <div className="text-sm text-muted-foreground">
                        500 000 € 
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold mb-1">Agrément ACPR</div>
                      <div className="text-sm text-muted-foreground">
                        N° 12345 - Établissement de crédit
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold mb-1">Contact</div>
                      <div className="text-sm text-muted-foreground">
                        contact@altusfinance.fr<br />
                        01 23 45 67 89
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground">
                    Altus Finance Group est un établissement de crédit agréé par l'Autorité de Contrôle Prudentiel et de Résolution (ACPR).
                    Soumis au contrôle de l'ACPR - 4 Place de Budapest, CS 92459, 75436 Paris Cedex 09.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
