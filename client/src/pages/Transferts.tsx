import InfoTicker from "@/components/InfoTicker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ArrowRightLeft, Clock, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { useAccounts, useTransfer, useTransactions } from "@/lib/api";

export default function Transferts() {
  const [amount, setAmount] = useState('');
  const [recipient, setRecipient] = useState('');
  const [reference, setReference] = useState('');
  const [selectedAccount, setSelectedAccount] = useState<string>('');
  const { toast } = useToast();
  const { data: accounts, isLoading: accountsLoading } = useAccounts();
  const transferMutation = useTransfer();
  const firstAccount = accounts?.[0];
  const { data: transactions } = useTransactions(firstAccount?.id);

  const recentTransfers = transactions
    ?.filter(t => t.type === 'debit' && t.category === 'Virement')
    .slice(0, 3)
    .map(t => ({
      id: t.id,
      recipient: t.description.replace('Virement - ', ''),
      amount: Math.abs(parseFloat(t.amount)),
      date: new Date(t.date).toLocaleDateString('fr-FR'),
      status: t.status,
    })) || [];

  const handleTransfer = async () => {
    if (!selectedAccount && !firstAccount) return;

    try {
      await transferMutation.mutateAsync({
        fromAccountId: selectedAccount || firstAccount!.id,
        toAccountNumber: recipient,
        amount: amount,
        description: reference || `Virement vers ${recipient}`,
      });

      toast({
        title: "Transfert effectué",
        description: `Transfert de ${amount} € vers ${recipient} effectué avec succès.`,
      });
      
      setAmount('');
      setRecipient('');
      setReference('');
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors du transfert.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <InfoTicker />
      
      <div className="flex-1 p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Transferts</h1>
          <p className="text-muted-foreground mt-1">
            Effectuez vos virements en toute sécurité
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <Card data-testid="card-new-transfer">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                  <ArrowRightLeft className="h-5 w-5 text-primary" />
                </div>
                <CardTitle>Nouveau transfert</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="from-account">Depuis le compte</Label>
                <Select value={selectedAccount || firstAccount?.id} onValueChange={setSelectedAccount} disabled={accountsLoading}>
                  <SelectTrigger id="from-account" data-testid="select-from-account">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {accounts?.map((account) => (
                      <SelectItem key={account.id} value={account.id}>
                        {account.name} - {parseFloat(account.balance).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="recipient">Bénéficiaire</Label>
                <Input
                  id="recipient"
                  placeholder="Nom ou IBAN du bénéficiaire"
                  value={recipient}
                  onChange={(e) => setRecipient(e.target.value)}
                  data-testid="input-recipient"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="amount">Montant</Label>
                <div className="relative">
                  <Input
                    id="amount"
                    type="number"
                    placeholder="0.00"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    data-testid="input-amount"
                  />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground">
                    €
                  </span>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="reference">Référence (optionnel)</Label>
                <Input
                  id="reference"
                  placeholder="Motif du virement"
                  value={reference}
                  onChange={(e) => setReference(e.target.value)}
                  data-testid="input-reference"
                />
              </div>

              <Button 
                className="w-full" 
                onClick={handleTransfer}
                disabled={!amount || !recipient || transferMutation.isPending}
                data-testid="button-submit-transfer"
              >
                Effectuer le transfert
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Les transferts sont traités instantanément entre comptes Altus
              </p>
            </CardContent>
          </Card>

          <Card data-testid="card-recent-transfers">
            <CardHeader>
              <CardTitle>Transferts récents</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {recentTransfers.map((transfer) => (
                  <div
                    key={transfer.id}
                    className="flex items-center justify-between p-3 rounded-lg hover-elevate border"
                    data-testid={`row-recent-transfer-${transfer.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        transfer.status === 'completed' ? 'bg-chart-3/10' : 'bg-chart-2/10'
                      }`}>
                        {transfer.status === 'completed' ? (
                          <CheckCircle2 className="h-5 w-5 text-chart-3" />
                        ) : (
                          <Clock className="h-5 w-5 text-chart-2" />
                        )}
                      </div>
                      <div>
                        <p className="font-medium">{transfer.recipient}</p>
                        <p className="text-sm text-muted-foreground">{transfer.date}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold">-{transfer.amount.toLocaleString('fr-FR')} €</p>
                      <Badge variant={transfer.status === 'completed' ? 'default' : 'secondary'} className="mt-1">
                        {transfer.status === 'completed' ? 'Complété' : 'En attente'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
