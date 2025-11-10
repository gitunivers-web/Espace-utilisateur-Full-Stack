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
import { useLoans, useLoanTypes, useCreateLoanApplication } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { useState, useMemo } from "react";
import { useToast } from "@/hooks/use-toast";
import { Link } from "wouter";

export default function Prets() {
  const { data: loans, isLoading: loansLoading } = useLoans();
  const { data: loanTypes, isLoading: loanTypesLoading } = useLoanTypes();
  const createLoanApplication = useCreateLoanApplication();
  const { toast } = useToast();
  const [loanAmount, setLoanAmount] = useState(50000);
  const [loanDuration, setLoanDuration] = useState("36");
  const [selectedLoanTypeId, setSelectedLoanTypeId] = useState<string>("");
  const [monthlyIncome, setMonthlyIncome] = useState(3000);
  const [employmentStatus, setEmploymentStatus] = useState("CDI");

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

  const handleLoanRequest = async () => {
    if (!selectedLoanTypeId) {
      toast({
        title: "Type de prêt requis",
        description: "Veuillez sélectionner un type de prêt avant de continuer.",
        variant: "destructive",
      });
      return;
    }

    try {
      await createLoanApplication.mutateAsync({
        applicationType: "particular",
        loanTypeId: selectedLoanTypeId,
        amount: loanAmount,
        durationMonths: parseInt(loanDuration),
        estimatedRate: interestRate,
        estimatedMonthlyPayment: monthlyPayment,
        monthlyIncome,
        employmentStatus,
        purpose: "Demande via simulateur de prêt",
      });

      toast({
        title: "Demande envoyée avec succès",
        description: `Votre demande de ${loanAmount.toLocaleString('fr-FR')} € sur ${loanDuration} mois a été soumise. Vous recevrez une réponse sous 48h.`,
      });

      setLoanAmount(50000);
      setLoanDuration("36");
      setSelectedLoanTypeId("");
      setMonthlyIncome(3000);
      setEmploymentStatus("CDI");
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue lors de l'envoi de votre demande.",
        variant: "destructive",
      });
    }
  };


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
                <div className="space-y-2">
                  <Label htmlFor="loan-type" className="text-sm sm:text-base">Type de prêt</Label>
                  <Select 
                    value={selectedLoanTypeId} 
                    onValueChange={setSelectedLoanTypeId}
                    disabled={loanTypesLoading}
                  >
                    <SelectTrigger id="loan-type" data-testid="select-loan-type">
                      <SelectValue placeholder="Sélectionnez un type de prêt" />
                    </SelectTrigger>
                    <SelectContent>
                      {loanTypes && Array.isArray(loanTypes) && loanTypes.map((loanType: any) => (
                        <SelectItem key={loanType.id} value={loanType.id}>
                          {loanType.nameKey} - Taux dès {parseFloat(loanType.minRate)}%
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

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

                <div className="space-y-2">
                  <Label htmlFor="monthly-income" className="text-sm sm:text-base">Revenu mensuel</Label>
                  <Input
                    id="monthly-income"
                    type="number"
                    value={monthlyIncome}
                    onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                    min={0}
                    step={100}
                    data-testid="input-monthly-income"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employment-status" className="text-sm sm:text-base">Statut d'emploi</Label>
                  <Select value={employmentStatus} onValueChange={setEmploymentStatus}>
                    <SelectTrigger id="employment-status" data-testid="select-employment-status">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="CDI">CDI</SelectItem>
                      <SelectItem value="CDD">CDD</SelectItem>
                      <SelectItem value="Indépendant">Indépendant</SelectItem>
                      <SelectItem value="Retraité">Retraité</SelectItem>
                      <SelectItem value="Autre">Autre</SelectItem>
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
                  disabled={!selectedLoanTypeId || createLoanApplication.isPending}
                  data-testid="button-submit-loan-request"
                >
                  {createLoanApplication.isPending ? "Envoi en cours..." : "Envoyer la demande"}
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
            <div className="flex items-center justify-between mb-3 sm:mb-4">
              <h2 className="text-lg sm:text-xl font-semibold">Offres de financement</h2>
              <Link href="/mon-espace/nouvelle-demande">
                <Button variant="outline" size="sm">Faire une demande</Button>
              </Link>
            </div>
            {loanTypesLoading ? (
              <div className="text-center text-muted-foreground py-8 text-sm">Chargement...</div>
            ) : loanTypes && Array.isArray(loanTypes) ? (
              <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2">
                {loanTypes.map((loanType: any) => (
                  <Card key={loanType.id} className="hover-elevate" data-testid={`card-loan-offer-${loanType.id}`}>
                    <CardHeader>
                      <div className="flex items-center gap-2 sm:gap-3">
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-md bg-gold/10 flex items-center justify-center flex-shrink-0">
                          <Euro className="h-4 w-4 sm:h-5 sm:w-5 text-gold" />
                        </div>
                        <CardTitle className="text-base sm:text-lg">{loanType.nameKey}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-xs sm:text-sm text-muted-foreground">{loanType.descriptionKey}</p>
                      <div className="flex justify-between">
                        <span className="text-xs sm:text-sm text-muted-foreground">Taux à partir de</span>
                        <span className="text-sm sm:text-base font-semibold text-primary">{parseFloat(loanType.minRate)}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs sm:text-sm text-muted-foreground">Montant max</span>
                        <span className="text-sm sm:text-base font-semibold">{parseFloat(loanType.maxAmount).toLocaleString('fr-FR')} €</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-xs sm:text-sm text-muted-foreground">Durée max</span>
                        <span className="text-sm sm:text-base font-semibold">{loanType.maxDurationMonths} mois</span>
                      </div>
                      <Link href="/mon-espace/nouvelle-demande">
                        <Button className="w-full mt-4" variant="outline" data-testid={`button-apply-loan-${loanType.id}`}>
                          Faire une demande
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center text-muted-foreground py-8 text-sm">Aucune offre disponible</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
