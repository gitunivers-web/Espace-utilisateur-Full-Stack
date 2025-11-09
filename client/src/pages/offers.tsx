import { useLoanTypes } from "@/lib/queries";
import { LoanCard } from "@/components/loan/LoanCard";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useLocation } from "wouter";
import { useState } from "react";

export default function Offers() {
  const [, setLocation] = useLocation();
  const [category, setCategory] = useState<string | undefined>(undefined);
  const { data: loanTypes, isLoading } = useLoanTypes(category);

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Nos Offres de Financement</h1>
          <p className="text-xl text-muted-foreground">
            Découvrez toutes nos solutions de prêts adaptées à vos besoins
          </p>
        </div>

        <div className="mb-8 flex gap-2 flex-wrap">
          <Button
            variant={!category ? "default" : "outline"}
            onClick={() => setCategory(undefined)}
            data-testid="filter-all"
          >
            Toutes les offres
          </Button>
          <Button
            variant={category === "particular" ? "default" : "outline"}
            onClick={() => setCategory("particular")}
            data-testid="filter-particular"
          >
            Particuliers
          </Button>
          <Button
            variant={category === "professional" ? "default" : "outline"}
            onClick={() => setCategory("professional")}
            data-testid="filter-professional"
          >
            Professionnels
          </Button>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {loanTypes?.map((loanType) => (
              <LoanCard
                key={loanType.id}
                loanType={loanType}
                onSelect={() => setLocation(`/auth/connexion?redirect=/mon-espace&loanType=${loanType.id}`)}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
