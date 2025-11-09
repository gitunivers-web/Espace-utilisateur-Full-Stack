import InfoTicker from "@/components/InfoTicker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { TrendingUp, Calendar, Euro, Calculator } from "lucide-react";
import { useLoans } from "@/lib/api";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";

export default function Prets() {
  const { data: loans, isLoading: loansLoading } = useLoans();
  const { toast } = useToast();
  const [loanAmount, setLoanAmount] = useState(50000);
  const [loanDuration, setLoanDuration] = useState("36");

  // Calcul automatique du taux d'intérêt basé sur le montant et la durée
  const calculateInterestRate = (amount: number, duration: number): number => {
    let baseRate = 2.5;
    
    // Meilleur taux pour les montants élevés
    if (amount >= 100000) baseRate = 1.9;
    else if (amount >= 50000) baseRate = 2.1;
    else if (amount >= 25000) baseRate = 2.3;
    
    // Ajustement selon la durée
    if (duration <= 12) baseRate -= 0.2;
    else if (duration >= 60) baseRate += 0.3;
    
    return parseFloat(baseRate.toFixed(2));
  };

  const interestRate = useMemo(() => 
    calculateInterestRate(loanAmount, parseInt(loanDuration)), 
    [loanAmount, loanDuration]
  );

  // Calcul de la mensualité avec intérêts composés
  const monthlyPayment = useMemo(() => {
    const duration = parseInt(loanDuration);
    const monthlyRate = interestRate / 100 / 12;
    const totalAmount = loanAmount * Math.pow(1 + monthlyRate, duration);
    return totalAmount / duration;
  }, [loanAmount, loanDuration, interestRate]);

  const handleLoanRequest = () => {
    toast({
      title: "Demande de prêt envoyée",
      description: `Votre demande de ${loanAmount.toLocaleString('fr-FR')} € sur ${loanDuration} mois a été envoyée pour approbation.`,
    });
    
    // Réinitialisation
    setLoanAmount(50000);
    setLoanDuration("36");
  };

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
          {/* Formulaire de demande de prêt */}
          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Faire une demande de prêt</h2>
            <Card className="bg-gradient-to-br from-primary/5 to-primary/10 border-primary/20" data-testid="card-loan-request">
              <CardHeader>
                <div className="flex items-center gap-2 sm:gap-3">
                  <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-md bg-primary/20 flex items-center justify-center flex-shrink-0">
                    <Calculator className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base sm:text-lg">Simulateur de prêt</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="space-y-5 sm:space-y-6">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm sm:text-base">Montant du prêt</Label>
                    <span className="text-xl sm:text-2xl font-bold text-primary">
                      {loanAmount.toLocaleString('fr-FR')} €
                    </span>
                  </div>
                  <Slider
                    value={[loanAmount]}
                    onValueChange={(value) => setLoanAmount(value[0])}
                    min={5000}
                    max={200000}
                    step={1000}
                    className="w-full"
                    data-testid="slider-loan-amount"
                  />
                  <div className="flex items-center justify-between text-xs sm:text-sm text-muted-foreground">
                    <span>5 000 €</span>
                    <span>200 000 €</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-sm sm:text-base">Durée du prêt</Label>
                  <Select value={loanDuration} onValueChange={setLoanDuration}>
                    <SelectTrigger id="duration" data-testid="select-loan-duration">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="12">12 mois (1 an)</SelectItem>
                      <SelectItem value="24">24 mois (2 ans)</SelectItem>
                      <SelectItem value="36">36 mois (3 ans)</SelectItem>
                      <SelectItem value="48">48 mois (4 ans)</SelectItem>
                      <SelectItem value="60">60 mois (5 ans)</SelectItem>
                      <SelectItem value="72">72 mois (6 ans)</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 p-4 rounded-lg bg-background/50 border">
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm text-muted-foreground">Taux d'intérêt</p>
                    <p className="text-2xl sm:text-3xl font-bold text-primary" data-testid="text-interest-rate">
                      {interestRate}%
                    </p>
                    <p className="text-xs text-muted-foreground">Taux calculé automatiquement</p>
                  </div>
                  <div className="space-y-1">
                    <p className="text-xs sm:text-sm text-muted-foreground">Mensualité</p>
                    <p className="text-2xl sm:text-3xl font-bold text-foreground" data-testid="text-monthly-payment">
                      {monthlyPayment.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                    </p>
                    <p className="text-xs text-muted-foreground">Sur {loanDuration} mois</p>
                  </div>
                </div>

                <div className="p-3 sm:p-4 rounded-lg bg-muted/50 space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Montant emprunté</span>
                    <span className="font-semibold">{loanAmount.toLocaleString('fr-FR')} €</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">Intérêts totaux</span>
                    <span className="font-semibold">
                      {((monthlyPayment * parseInt(loanDuration)) - loanAmount).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm pt-2 border-t">
                    <span className="font-semibold">Montant total à rembourser</span>
                    <span className="font-bold text-base sm:text-lg">
                      {(monthlyPayment * parseInt(loanDuration)).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                    </span>
                  </div>
                </div>

                <Button 
                  className="w-full" 
                  size="lg"
                  onClick={handleLoanRequest}
                  data-testid="button-submit-loan-request"
                >
                  Faire une demande
                </Button>

                <p className="text-xs text-center text-muted-foreground">
                  Votre demande sera étudiée sous 48h. Taux sous réserve d'acceptation du dossier.
                </p>
              </CardContent>
            </Card>
          </div>

          {/* Prêts en cours */}
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

          {/* Offres de financement */}
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
