import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Search, ArrowUpRight, ArrowDownLeft } from "lucide-react";
import { useState } from "react";
import { useAccounts, useTransactions } from "@/lib/api";

export default function TransactionTable() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: accounts } = useAccounts();
  const firstAccount = accounts?.[0];
  const { data: transactions, isLoading } = useTransactions(firstAccount?.id);

  const filteredTransactions = transactions?.filter(transaction =>
    transaction.description.toLowerCase().includes(searchQuery.toLowerCase())
  ) || [];

  return (
    <Card data-testid="card-transactions">
      <CardHeader>
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4 flex-wrap">
          <CardTitle className="text-base sm:text-lg">Historique des transactions</CardTitle>
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 sm:h-4 sm:w-4 text-muted-foreground" />
            <Input
              placeholder="Rechercher..."
              className="pl-8 sm:pl-9 text-sm"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              data-testid="input-transaction-search"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div className="text-center text-muted-foreground py-8 text-sm">Chargement...</div>
        ) : filteredTransactions.length === 0 ? (
          <div className="text-center text-muted-foreground py-8 text-sm">Aucune transaction trouvée</div>
        ) : (
          <div className="space-y-2">
            {filteredTransactions.map((transaction) => (
              <div
                key={transaction.id}
                className="flex items-center justify-between p-3 sm:p-4 rounded-lg hover-elevate border gap-2 sm:gap-4"
                data-testid={`row-transaction-${transaction.id}`}
              >
                <div className="flex items-center gap-2 sm:gap-3 md:gap-4 flex-1 min-w-0">
                  <div className={`h-8 w-8 sm:h-10 sm:w-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                    transaction.type === 'credit' ? 'bg-chart-3/10' : 'bg-chart-5/10'
                  }`}>
                    {transaction.type === 'credit' ? (
                      <ArrowDownLeft className="h-4 w-4 sm:h-5 sm:w-5 text-chart-3" />
                    ) : (
                      <ArrowUpRight className="h-4 w-4 sm:h-5 sm:w-5 text-chart-5" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium truncate text-sm sm:text-base" data-testid={`text-transaction-description-${transaction.id}`}>
                      {transaction.description}
                    </p>
                    <div className="flex items-center gap-2 mt-1 flex-wrap">
                      <p className="text-xs sm:text-sm text-muted-foreground">{new Date(transaction.date).toLocaleDateString('fr-FR')}</p>
                      <Badge variant="secondary" className="text-xs">
                        {transaction.category}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <p className={`font-semibold text-sm sm:text-base ${
                    transaction.type === 'credit' ? 'text-chart-3' : 'text-foreground'
                  }`} data-testid={`text-transaction-amount-${transaction.id}`}>
                    {parseFloat(transaction.amount) > 0 ? '+' : ''}{parseFloat(transaction.amount).toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €
                  </p>
                  <Badge 
                    variant={transaction.status === 'completed' ? 'default' : 'secondary'}
                    className="text-xs mt-1"
                  >
                    {transaction.status === 'completed' ? 'Complété' : 'En attente'}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
