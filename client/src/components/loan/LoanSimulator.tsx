import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useLoanTypes, useLoanSimulation } from "@/lib/queries";
import { Loader2, Calculator } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export function LoanSimulator() {
  const { data: loanTypes, isLoading } = useLoanTypes();
  const simulate = useLoanSimulation();
  const { toast } = useToast();

  const [selectedLoanTypeId, setSelectedLoanTypeId] = useState<string>("");
  const [amount, setAmount] = useState<number>(10000);
  const [durationMonths, setDurationMonths] = useState<number>(24);

  const selectedLoanType = loanTypes?.find(lt => lt.id === selectedLoanTypeId);

  useEffect(() => {
    if (loanTypes && loanTypes.length > 0 && !selectedLoanTypeId) {
      setSelectedLoanTypeId(loanTypes[0].id);
    }
  }, [loanTypes, selectedLoanTypeId]);

  useEffect(() => {
    if (selectedLoanType) {
      const minAmount = parseFloat(selectedLoanType.minAmount);
      const maxAmount = parseFloat(selectedLoanType.maxAmount);
      if (amount < minAmount) setAmount(minAmount);
      if (amount > maxAmount) setAmount(maxAmount);

      if (durationMonths < selectedLoanType.minDurationMonths) {
        setDurationMonths(selectedLoanType.minDurationMonths);
      }
      if (durationMonths > selectedLoanType.maxDurationMonths) {
        setDurationMonths(selectedLoanType.maxDurationMonths);
      }
    }
  }, [selectedLoanType, amount, durationMonths]);

  const handleSimulate = () => {
    if (!selectedLoanTypeId) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Veuillez sélectionner un type de prêt",
      });
      return;
    }

    simulate.mutate({ loanTypeId: selectedLoanTypeId, amount, durationMonths });
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  return (
    <Card data-testid="card-loan-simulator">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Calculator className="h-5 w-5" />
          Simulateur de Prêt
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Type de prêt</Label>
          <Select value={selectedLoanTypeId} onValueChange={setSelectedLoanTypeId}>
            <SelectTrigger data-testid="select-loan-type">
              <SelectValue placeholder="Sélectionnez un type de prêt" />
            </SelectTrigger>
            <SelectContent>
              {loanTypes?.map((loanType) => (
                <SelectItem key={loanType.id} value={loanType.id}>
                  {loanType.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Montant</Label>
            <div className="text-2xl font-bold text-primary">{amount.toLocaleString()}€</div>
          </div>
          <Slider
            value={[amount]}
            onValueChange={([value]) => setAmount(value)}
            min={selectedLoanType ? parseFloat(selectedLoanType.minAmount) : 500}
            max={selectedLoanType ? parseFloat(selectedLoanType.maxAmount) : 75000}
            step={500}
            data-testid="slider-amount"
          />
          {selectedLoanType && (
            <div className="text-xs text-muted-foreground">
              De {parseFloat(selectedLoanType.minAmount).toLocaleString()}€ à{" "}
              {parseFloat(selectedLoanType.maxAmount).toLocaleString()}€
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>Durée</Label>
            <div className="text-2xl font-bold text-primary">{durationMonths} mois</div>
          </div>
          <Slider
            value={[durationMonths]}
            onValueChange={([value]) => setDurationMonths(value)}
            min={selectedLoanType?.minDurationMonths || 6}
            max={selectedLoanType?.maxDurationMonths || 84}
            step={6}
            data-testid="slider-duration"
          />
          {selectedLoanType && (
            <div className="text-xs text-muted-foreground">
              De {selectedLoanType.minDurationMonths} à {selectedLoanType.maxDurationMonths} mois
            </div>
          )}
        </div>

        <Button
          onClick={handleSimulate}
          className="w-full"
          disabled={simulate.isPending}
          data-testid="button-calculate"
        >
          {simulate.isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Calcul en cours...
            </>
          ) : (
            "Calculer"
          )}
        </Button>

        {simulate.data && (
          <div className="mt-6 space-y-4">
            <div className="p-6 bg-primary/5 rounded-lg space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2 text-center pb-4 border-b">
                  <div className="text-sm text-muted-foreground mb-1">TAEG Fixe</div>
                  <div className="text-4xl font-bold text-primary">
                    {simulate.data.taeg.toFixed(2)}%
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Mensualité</div>
                  <div className="text-3xl font-bold text-primary">
                    {simulate.data.monthlyPayment.toLocaleString()}€
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Coût total du crédit</div>
                  <div className="text-2xl font-semibold">
                    {simulate.data.totalInterest.toLocaleString()}€
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Montant total dû</div>
                  <div className="text-lg font-semibold">
                    {simulate.data.totalCost.toLocaleString()}€
                  </div>
                </div>
                <div>
                  <div className="text-sm text-muted-foreground">Intérêts</div>
                  <div className="text-lg font-semibold">
                    {simulate.data.totalInterest.toLocaleString()}€
                  </div>
                </div>
              </div>
            </div>
            <div className="text-xs text-muted-foreground p-3 bg-muted/50 rounded-md">
              <p className="font-semibold mb-1">Informations légales</p>
              <p>Vous disposez d'un délai de rétractation de 14 jours après la signature du contrat de crédit. Un crédit vous engage et doit être remboursé.</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
