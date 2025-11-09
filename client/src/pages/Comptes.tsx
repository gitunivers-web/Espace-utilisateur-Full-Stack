import InfoTicker from "@/components/InfoTicker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, CreditCard, Plus } from "lucide-react";
import { useAccounts, useCards } from "@/lib/api";

export default function Comptes() {
  const { data: accounts, isLoading: accountsLoading } = useAccounts();
  const { data: cards, isLoading: cardsLoading } = useCards();

  return (
    <div className="flex flex-col min-h-screen">
      <InfoTicker />
      
      <div className="flex-1 p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
        <div className="flex items-start sm:items-center justify-between flex-wrap gap-3 sm:gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl sm:text-3xl font-bold">Comptes & Cartes</h1>
            <p className="text-sm sm:text-base text-muted-foreground">
              Gérez vos comptes et cartes bancaires
            </p>
          </div>
          <Button data-testid="button-add-account" className="w-full sm:w-auto">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau compte
          </Button>
        </div>

        <div className="space-y-5 sm:space-y-6">
          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Mes Comptes</h2>
            {accountsLoading ? (
              <div className="text-center text-muted-foreground py-8 text-sm">Chargement...</div>
            ) : (
              <div className="grid gap-3 sm:gap-4 grid-cols-1 lg:grid-cols-2">
                {accounts?.map((account) => (
                  <Card key={account.id} className="hover-elevate" data-testid={`card-account-${account.id}`}>
                    <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                      <CardTitle className="text-sm sm:text-base font-medium">{account.name}</CardTitle>
                      <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-xs sm:text-sm text-muted-foreground font-mono break-all">{account.accountNumber}</p>
                        <div className="flex items-center justify-between gap-2 flex-wrap">
                          <div>
                            <p className="text-xl sm:text-2xl font-bold break-words">{parseFloat(account.balance).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</p>
                            <Badge variant="secondary" className="mt-2">{account.type}</Badge>
                          </div>
                          <Button variant="outline" size="sm" data-testid={`button-view-account-${account.id}`}>
                            Détails
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div>
            <h2 className="text-lg sm:text-xl font-semibold mb-3 sm:mb-4">Mes Cartes</h2>
            {cardsLoading ? (
              <div className="text-center text-muted-foreground py-8 text-sm">Chargement...</div>
            ) : (
              <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 xl:grid-cols-3">
                {cards?.map((card) => (
                  <Card key={card.id} className="hover-elevate" data-testid={`card-payment-card-${card.id}`}>
                    <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
                      <CardTitle className="text-sm sm:text-base font-medium">{card.name}</CardTitle>
                      <CreditCard className="h-4 w-4 sm:h-5 sm:w-5 text-primary flex-shrink-0" />
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-base sm:text-lg font-mono break-all">{card.cardNumber}</p>
                      <div className="flex items-center justify-between gap-2 flex-wrap">
                        <div>
                          <p className="text-xs sm:text-sm text-muted-foreground">{card.cardType}</p>
                          <Badge variant="default" className="mt-1">{card.status}</Badge>
                        </div>
                        <Button variant="ghost" size="sm" data-testid={`button-manage-card-${card.id}`}>
                          Gérer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Card className="hover-elevate border-dashed flex items-center justify-center min-h-[180px] sm:min-h-[200px]" data-testid="card-add-card">
                  <Button variant="ghost" className="h-full w-full" data-testid="button-add-card">
                    <div className="text-center">
                      <Plus className="h-7 w-7 sm:h-8 sm:w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-xs sm:text-sm text-muted-foreground">Ajouter une carte</p>
                    </div>
                  </Button>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
