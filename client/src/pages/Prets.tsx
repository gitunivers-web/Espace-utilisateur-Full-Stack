import InfoTicker from "@/components/InfoTicker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar, Euro } from "lucide-react";

export default function Prets() {
  const loans = [
    {
      id: '1',
      name: 'Prêt Professionnel',
      amount: 100000,
      borrowed: 97500,
      monthly: 5000,
      rate: 2.5,
      endDate: '2026-12-31',
      status: 'active',
    },
  ];

  const loanOffers = [
    { id: '1', name: 'Prêt Expansion', rate: 2.3, maxAmount: 200000, duration: '5 ans' },
    { id: '2', name: 'Prêt Équipement', rate: 1.9, maxAmount: 50000, duration: '3 ans' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <InfoTicker />
      
      <div className="flex-1 p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Prêts & Financements</h1>
          <p className="text-muted-foreground mt-1">
            Gérez vos prêts et découvrez nos offres
          </p>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Mes Prêts en cours</h2>
            <div className="grid gap-4">
              {loans.map((loan) => (
                <Card key={loan.id} className="hover-elevate" data-testid={`card-loan-${loan.id}`}>
                  <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                    <div className="flex items-center gap-3">
                      <div className="h-12 w-12 rounded-md bg-primary/10 flex items-center justify-center">
                        <TrendingUp className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle>{loan.name}</CardTitle>
                        <Badge variant="default" className="mt-1">{loan.status === 'active' ? 'Actif' : 'Terminé'}</Badge>
                      </div>
                    </div>
                    <Button variant="outline" data-testid={`button-loan-details-${loan.id}`}>
                      Voir détails
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-6 md:grid-cols-3 mb-4">
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Montant total</p>
                        <p className="text-2xl font-bold">{loan.amount.toLocaleString('fr-FR')} €</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Mensualité</p>
                        <p className="text-2xl font-bold">{loan.monthly.toLocaleString('fr-FR')} €</p>
                      </div>
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Taux</p>
                        <p className="text-2xl font-bold">{loan.rate}%</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Progression</span>
                        <span className="font-medium">{((loan.borrowed / loan.amount) * 100).toFixed(0)}% remboursé</span>
                      </div>
                      <Progress value={(loan.borrowed / loan.amount) * 100} className="h-2" data-testid={`progress-loan-${loan.id}`} />
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Fin prévue : {new Date(loan.endDate).toLocaleDateString('fr-FR')}
                        </span>
                        <span className="font-medium">{(loan.amount - loan.borrowed).toLocaleString('fr-FR')} € restant</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-4">Offres de financement</h2>
            <div className="grid gap-4 md:grid-cols-2">
              {loanOffers.map((offer) => (
                <Card key={offer.id} className="hover-elevate" data-testid={`card-loan-offer-${offer.id}`}>
                  <CardHeader>
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 rounded-md bg-gold/10 flex items-center justify-center">
                        <Euro className="h-5 w-5 text-gold" />
                      </div>
                      <CardTitle>{offer.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Taux</span>
                      <span className="font-semibold text-primary">{offer.rate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Montant max</span>
                      <span className="font-semibold">{offer.maxAmount.toLocaleString('fr-FR')} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-muted-foreground">Durée</span>
                      <span className="font-semibold">{offer.duration}</span>
                    </div>
                    <Button className="w-full mt-4" variant="outline" data-testid={`button-apply-loan-${offer.id}`}>
                      Faire une demande
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
