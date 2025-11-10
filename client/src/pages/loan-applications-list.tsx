/**
 * Page Mes Demandes de Prêt - Liste et gestion des demandes
 * 
 * @component LoanApplicationsList
 * @description Page protégée dans l'espace client affichant toutes les demandes
 * de prêt de l'utilisateur avec filtres, recherche et statuts.
 * 
 * @route /mon-espace/demandes
 * @layout ProtectedRouter (avec sidebar)
 * 
 * @features
 * - Liste de toutes les demandes avec statut
 * - Filtres par statut (pending, approved, rejected, etc.)
 * - Recherche par type de prêt ou montant
 * - Affichage des détails de chaque demande
 * - Badge de statut coloré
 * - État vide si aucune demande
 */

import { useState } from "react";
import { Link } from "wouter";
import { useLoanApplications } from "@/lib/queries";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, Search, FileText, Plus, Calendar, CreditCard } from "lucide-react";
import type { LoanApplication } from "@shared/schema";
import { ContractSigning } from "@/components/loan/ContractSigning";

/**
 * Configuration des couleurs de badge selon le statut
 */
const STATUS_CONFIG = {
  pending: { label: "En attente", variant: "secondary" as const, color: "text-amber-600" },
  under_review: { label: "En cours d'étude", variant: "default" as const, color: "text-blue-600" },
  approved: { label: "Approuvée", variant: "default" as const, color: "text-green-600" },
  rejected: { label: "Refusée", variant: "destructive" as const, color: "text-red-600" },
  withdrawn: { label: "Annulée", variant: "secondary" as const, color: "text-gray-600" },
};

export default function LoanApplicationsList() {
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [searchTerm, setSearchTerm] = useState("");

  // Récupération des demandes de prêt
  const { data: applications, isLoading } = useLoanApplications();

  // Filtrage des demandes
  const filteredApplications = applications?.filter((app) => {
    const matchesStatus = statusFilter === "all" || app.status === statusFilter;
    const matchesSearch = 
      searchTerm === "" || 
      app.amount.toString().includes(searchTerm) ||
      app.purpose?.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  // Statistiques rapides
  const stats = {
    total: applications?.length || 0,
    pending: applications?.filter(a => a.status === "pending").length || 0,
    approved: applications?.filter(a => a.status === "approved").length || 0,
    rejected: applications?.filter(a => a.status === "rejected").length || 0,
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* En-tête */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold" data-testid="heading-applications">
            Mes Demandes de Prêt
          </h1>
          <p className="text-muted-foreground">
            Suivez l'avancement de vos demandes de financement
          </p>
        </div>
        <Link href="/demande">
          <Button data-testid="button-new-application">
            <Plus className="mr-2 h-4 w-4" />
            Nouvelle demande
          </Button>
        </Link>
      </div>

      {/* Statistiques rapides */}
      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <FileText className="h-5 w-5 text-primary" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Total</div>
              <div className="text-2xl font-bold">{stats.total}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-amber-100 dark:bg-amber-900/20 flex items-center justify-center">
              <Calendar className="h-5 w-5 text-amber-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">En attente</div>
              <div className="text-2xl font-bold">{stats.pending}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-green-100 dark:bg-green-900/20 flex items-center justify-center">
              <CreditCard className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Approuvées</div>
              <div className="text-2xl font-bold">{stats.approved}</div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4 flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-red-100 dark:bg-red-900/20 flex items-center justify-center">
              <FileText className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <div className="text-sm text-muted-foreground">Refusées</div>
              <div className="text-2xl font-bold">{stats.rejected}</div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filtres et recherche */}
      <Card>
        <CardContent className="p-4 space-y-4">
          <div className="flex flex-wrap gap-4 items-center">
            {/* Filtres par statut */}
            <Tabs value={statusFilter} onValueChange={setStatusFilter}>
              <TabsList>
                <TabsTrigger value="all" data-testid="filter-all">
                  Toutes
                </TabsTrigger>
                <TabsTrigger value="pending" data-testid="filter-pending">
                  En attente
                </TabsTrigger>
                <TabsTrigger value="under_review" data-testid="filter-under-review">
                  En étude
                </TabsTrigger>
                <TabsTrigger value="approved" data-testid="filter-approved">
                  Approuvées
                </TabsTrigger>
                <TabsTrigger value="rejected" data-testid="filter-rejected">
                  Refusées
                </TabsTrigger>
              </TabsList>
            </Tabs>

            {/* Barre de recherche */}
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Rechercher par montant ou objet..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                  data-testid="input-search"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Liste des demandes */}
      <div className="space-y-4">
        {filteredApplications && filteredApplications.length > 0 ? (
          filteredApplications.map((application) => (
            <Card key={application.id} className="hover-elevate" data-testid={`card-application-${application.id}`}>
              <CardHeader>
                <div className="flex items-start justify-between gap-4 flex-wrap">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <CardTitle className="text-xl">
                        Demande de prêt - {Number(application.amount).toLocaleString()}€
                      </CardTitle>
                      <Badge variant={STATUS_CONFIG[application.status].variant}>
                        {STATUS_CONFIG[application.status].label}
                      </Badge>
                    </div>
                    <CardDescription>
                      {application.applicationType === "particular" ? "Particulier" : "Professionnel"}
                      {" • "}
                      {application.durationMonths} mois
                      {" • "}
                      {Number(application.estimatedMonthlyPayment).toLocaleString()}€/mois
                    </CardDescription>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Déposée le {new Date(application.submittedAt).toLocaleDateString("fr-FR")}
                  </div>
                </div>
              </CardHeader>
              <CardContent className="space-y-3">
                {/* Objet du prêt */}
                {application.purpose && (
                  <div>
                    <div className="text-sm font-medium mb-1">Objet du prêt</div>
                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                      {application.purpose}
                    </p>
                  </div>
                )}

                {/* Message de statut */}
                {application.statusMessage && (
                  <div>
                    <div className="text-sm font-medium mb-1">Message</div>
                    <p className="text-sm text-muted-foreground bg-muted/50 p-3 rounded-md">
                      {application.statusMessage}
                    </p>
                  </div>
                )}

                {/* Détails financiers */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-3 border-t">
                  <div>
                    <div className="text-xs text-muted-foreground">Montant</div>
                    <div className="font-semibold">{Number(application.amount).toLocaleString()}€</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Durée</div>
                    <div className="font-semibold">{application.durationMonths} mois</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Taux</div>
                    <div className="font-semibold">{Number(application.estimatedRate)}%</div>
                  </div>
                  <div>
                    <div className="text-xs text-muted-foreground">Mensualité</div>
                    <div className="font-semibold">
                      {Number(application.estimatedMonthlyPayment).toLocaleString()}€
                    </div>
                  </div>
                </div>

                {/* Signature de contrat pour les demandes approuvées */}
                {application.status === "approved" && (
                  <div className="pt-4 border-t">
                    <ContractSigning loanApplicationId={application.id} />
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        ) : (
          <Card>
            <CardContent className="p-12 text-center space-y-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-muted flex items-center justify-center">
                <FileText className="h-8 w-8 text-muted-foreground" />
              </div>
              <div className="space-y-2">
                <h3 className="text-lg font-semibold">Aucune demande trouvée</h3>
                <p className="text-muted-foreground">
                  {searchTerm || statusFilter !== "all"
                    ? "Essayez de modifier vos filtres de recherche"
                    : "Vous n'avez pas encore fait de demande de prêt"}
                </p>
              </div>
              {!searchTerm && statusFilter === "all" && (
                <Link href="/demande">
                  <Button>
                    <Plus className="mr-2 h-4 w-4" />
                    Faire une demande
                  </Button>
                </Link>
              )}
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
