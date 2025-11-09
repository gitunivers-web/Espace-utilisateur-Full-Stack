import { Card, CardContent } from "@/components/ui/card";
import { Shield, Users, Award, TrendingUp } from "lucide-react";

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

        <div className="space-y-8">
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
              <li>• <strong>Transparence</strong> : Des taux et conditions clairement affichés</li>
              <li>• <strong>Rapidité</strong> : Une réponse de principe sous 48h</li>
              <li>• <strong>Accompagnement</strong> : Une équipe dédiée pour vous conseiller</li>
              <li>• <strong>Flexibilité</strong> : Des solutions adaptées à votre situation</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
