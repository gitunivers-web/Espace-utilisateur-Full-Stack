import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Check } from "lucide-react";
import type { LoanType } from "@shared/schema";

interface LoanCardProps {
  loanType: LoanType;
  onSelect?: () => void;
}

export function LoanCard({ loanType, onSelect }: LoanCardProps) {
  const minAmount = parseFloat(loanType.minAmount);
  const maxAmount = parseFloat(loanType.maxAmount);
  const minRate = parseFloat(loanType.minRate);

  return (
    <Card className="hover-elevate" data-testid={`card-loan-${loanType.id}`}>
      <CardHeader className="gap-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle>{loanType.name}</CardTitle>
          <Badge variant="secondary">{loanType.category === "particular" ? "Particulier" : "Professionnel"}</Badge>
        </div>
        <CardDescription>{loanType.description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div>
            <div className="text-muted-foreground">Montant</div>
            <div className="font-semibold">{minAmount.toLocaleString()}€ - {maxAmount.toLocaleString()}€</div>
          </div>
          <div>
            <div className="text-muted-foreground">Taux dès</div>
            <div className="font-semibold text-primary">{minRate}%</div>
          </div>
          <div>
            <div className="text-muted-foreground">Durée</div>
            <div className="font-semibold">{loanType.minDurationMonths} - {loanType.maxDurationMonths} mois</div>
          </div>
        </div>

        {loanType.features && loanType.features.length > 0 && (
          <div className="space-y-2">
            {loanType.features.slice(0, 3).map((feature, index) => (
              <div key={index} className="flex items-start gap-2 text-sm">
                <Check className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
                <span className="text-muted-foreground">{feature}</span>
              </div>
            ))}
          </div>
        )}

        {onSelect && (
          <Button 
            className="w-full" 
            onClick={onSelect}
            data-testid={`button-select-loan-${loanType.id}`}
          >
            Choisir cette offre
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
