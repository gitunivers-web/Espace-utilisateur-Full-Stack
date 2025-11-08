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
      
      <div className="flex-1 p-6 space-y-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div>
            <h1 className="text-3xl font-bold">Comptes & Cartes</h1>
            <p className="text-muted-foreground mt-1">
              Gérez vos comptes et cartes bancaires
            </p>
          </div>
          <Button data-testid="button-add-account">
            <Plus className="h-4 w-4 mr-2" />
            Nouveau compte
          </Button>
        </div>

        <div className="space-y-6">
          <div>
            <h2 className="text-xl font-semibold mb-4">Mes Comptes</h2>
            {accountsLoading ? (
              <div className="text-center text-muted-foreground py-8">Chargement...</div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {accounts?.map((account) => (
                  <Card key={account.id} className="hover-elevate" data-testid={`card-account-${account.id}`}>
                    <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0 pb-2">
                      <CardTitle className="text-base font-medium">{account.name}</CardTitle>
                      <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                        <Building2 className="h-5 w-5 text-primary" />
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-2">
                        <p className="text-sm text-muted-foreground font-mono">{account.accountNumber}</p>
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-2xl font-bold">{parseFloat(account.balance).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</p>
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
            <h2 className="text-xl font-semibold mb-4">Mes Cartes</h2>
            {cardsLoading ? (
              <div className="text-center text-muted-foreground py-8">Chargement...</div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                {cards?.map((card) => (
                  <Card key={card.id} className="hover-elevate" data-testid={`card-payment-card-${card.id}`}>
                    <CardHeader className="flex flex-row items-center justify-between gap-2 space-y-0">
                      <CardTitle className="text-base font-medium">{card.name}</CardTitle>
                      <CreditCard className="h-5 w-5 text-primary" />
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <p className="text-lg font-mono">{card.cardNumber}</p>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm text-muted-foreground">{card.cardType}</p>
                          <Badge variant="default" className="mt-1">{card.status}</Badge>
                        </div>
                        <Button variant="ghost" size="sm" data-testid={`button-manage-card-${card.id}`}>
                          Gérer
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                <Card className="hover-elevate border-dashed flex items-center justify-center min-h-[200px]" data-testid="card-add-card">
                  <Button variant="ghost" className="h-full w-full" data-testid="button-add-card">
                    <div className="text-center">
                      <Plus className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-sm text-muted-foreground">Ajouter une carte</p>
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
