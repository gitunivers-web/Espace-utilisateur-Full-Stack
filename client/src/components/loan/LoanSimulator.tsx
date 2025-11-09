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
import { LegalDisclaimers } from "@/components/legal/LegalNotice";
import { useTranslation } from "react-i18next";

export function LoanSimulator() {
  const { data: loanTypes, isLoading } = useLoanTypes();
  const simulate = useLoanSimulation();
  const { toast } = useToast();
  const { t } = useTranslation();

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
        title: t('simulator.error'),
        description: t('simulator.pleaseSelectLoanType'),
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
          {t('simulator.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>{t('simulator.loanType')}</Label>
          <Select value={selectedLoanTypeId} onValueChange={setSelectedLoanTypeId}>
            <SelectTrigger data-testid="select-loan-type">
              <SelectValue placeholder={t('simulator.selectLoanType')} />
            </SelectTrigger>
            <SelectContent>
              {loanTypes?.map((loanType) => (
                <SelectItem key={loanType.id} value={loanType.id}>
                  {t(loanType.nameKey)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Label>{t('simulator.amount')}</Label>
            <div className="text-xl sm:text-2xl font-bold text-primary">{amount.toLocaleString()}€</div>
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
              {t('simulator.from')} {parseFloat(selectedLoanType.minAmount).toLocaleString()}€ {t('simulator.to')}{" "}
              {parseFloat(selectedLoanType.maxAmount).toLocaleString()}€
            </div>
          )}
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Label>{t('simulator.duration')}</Label>
            <div className="text-xl sm:text-2xl font-bold text-primary">{durationMonths} {t('simulator.months')}</div>
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
              {t('simulator.from')} {selectedLoanType.minDurationMonths} {t('simulator.to')} {selectedLoanType.maxDurationMonths} {t('simulator.months')}
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
              {t('simulator.calculating')}
            </>
          ) : (
            t('simulator.calculate')
          )}
        </Button>

        {simulate.data && (
          <div className="mt-6 space-y-4">
            <div className="p-4 sm:p-6 bg-primary/5 rounded-lg space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="col-span-1 sm:col-span-2 text-center pb-4 border-b">
                  <div className="text-sm text-muted-foreground mb-1">{t('simulator.fixedAPR')}</div>
                  <div className="text-3xl sm:text-4xl font-bold text-primary">
                    {simulate.data.taeg.toFixed(2)}%
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-sm text-muted-foreground">{t('simulator.monthlyPayment')}</div>
                  <div className="text-2xl sm:text-3xl font-bold text-primary">
                    {simulate.data.monthlyPayment.toLocaleString()}€
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-sm text-muted-foreground">{t('simulator.totalCreditCost')}</div>
                  <div className="text-xl sm:text-2xl font-semibold">
                    {simulate.data.totalInterest.toLocaleString()}€
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-sm text-muted-foreground">{t('simulator.totalAmountDue')}</div>
                  <div className="text-lg font-semibold">
                    {simulate.data.totalCost.toLocaleString()}€
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <div className="text-sm text-muted-foreground">{t('simulator.interest')}</div>
                  <div className="text-lg font-semibold">
                    {simulate.data.totalInterest.toLocaleString()}€
                  </div>
                </div>
              </div>
            </div>
            <LegalDisclaimers />
          </div>
        )}
      </CardContent>
    </Card>
  );
}
