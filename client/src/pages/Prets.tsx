import InfoTicker from "@/components/InfoTicker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { TrendingUp, Calendar, Euro } from "lucide-react";
import { useLoans } from "@/lib/api";

export default function Prets() {
  const { data: loans, isLoading: loansLoading } = useLoans();

  const loanOffers = [
    { id: '1', name: 'Prêt Expansion', rate: 2.3, maxAmount: 200000, duration: '5 ans' },
    { id: '2', name: 'Prêt Équipement', rate: 1.9, maxAmount: 50000, duration: '3 ans' },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      <InfoTicker />
      
      <div className="flex-1 p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold">Prêts & Financements</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Gérez vos prêts et découvrez nos offres
          </p>
        </div>

        <div className="space-y-5 sm:space-y-6">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Mes Prêts en cours</h2>
            {loansLoading ? (
              <div className="text-center text-muted-foreground py-8 text-sm">Chargement...</div>
            ) : (
              <div className="grid gap-3 sm:gap-4">
              {loans?.map((loan) => (
                <Card key={loan.id} className="hover-elevate" data-testid={`card-loan-${loan.id}`}>
                  <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 space-y-0 pb-2">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="h-10 w-10 sm:h-12 sm:w-12 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle className="text-base sm:text-lg">{loan.name}</CardTitle>
                        <Badge variant="default" className="mt-1">{loan.status === 'active' ? 'Actif' : 'Terminé'}</Badge>
                      </div>
                    </div>
                    <Button variant="outline" size="sm" data-testid={`button-loan-details-${loan.id}`}>
                      Voir détails
                    </Button>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4 grid-cols-1 sm:grid-cols-3 mb-4">
                      <div>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-1">Montant total</p>
                        <p className="text-lg sm:text-xl md:text-2xl font-bold break-words">{parseFloat(loan.amount).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-1">Mensualité</p>
                        <p className="text-lg sm:text-xl md:text-2xl font-bold break-words">{parseFloat(loan.monthlyPayment).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</p>
                      </div>
                      <div>
                        <p className="text-xs sm:text-sm text-muted-foreground mb-1">Taux</p>
                        <p className="text-lg sm:text-xl md:text-2xl font-bold">{parseFloat(loan.interestRate)}%</p>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center justify-between text-xs sm:text-sm">
                        <span className="text-muted-foreground">Progression</span>
                        <span className="font-medium">{((parseFloat(loan.borrowed) / parseFloat(loan.amount)) * 100).toFixed(0)}% remboursé</span>
                      </div>
                      <Progress value={(parseFloat(loan.borrowed) / parseFloat(loan.amount)) * 100} className="h-2" data-testid={`progress-loan-${loan.id}`} />
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 text-xs sm:text-sm">
                        <span className="text-muted-foreground flex items-center gap-1">
                          <Calendar className="h-3 w-3 sm:h-4 sm:w-4" />
                          Fin prévue : {new Date(loan.endDate).toLocaleDateString('fr-FR')}
                        </span>
                        <span className="font-medium">{(parseFloat(loan.amount) - parseFloat(loan.borrowed)).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} € restant</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
            )}
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Offres de financement</h2>
            <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2">
              {loanOffers.map((offer) => (
                <Card key={offer.id} className="hover-elevate" data-testid={`card-loan-offer-${offer.id}`}>
                  <CardHeader>
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-md bg-gold/10 flex items-center justify-center flex-shrink-0">
                        <Euro className="h-4 w-4 sm:h-5 sm:w-5 text-gold" />
                      </div>
                      <CardTitle className="text-base sm:text-lg">{offer.name}</CardTitle>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-xs sm:text-sm text-muted-foreground">Taux</span>
                      <span className="text-sm sm:text-base font-semibold text-primary">{offer.rate}%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs sm:text-sm text-muted-foreground">Montant max</span>
                      <span className="text-sm sm:text-base font-semibold">{offer.maxAmount.toLocaleString('fr-FR')} €</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-xs sm:text-sm text-muted-foreground">Durée</span>
                      <span className="text-sm sm:text-base font-semibold">{offer.duration}</span>
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
