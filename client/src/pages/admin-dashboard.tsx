import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  FileText, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertCircle, 
  User,
  Download,
  MessageSquare
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { usePendingLoanApplications, useApproveLoanApplication, useRejectLoanApplication, useRequestMoreInfo } from "@/lib/api";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface LoanApplicationWithUser {
  id: string;
  amount: string;
  durationMonths: number;
  status: string;
  submittedAt: string;
  applicationType: string;
  monthlyIncome?: string;
  employmentStatus?: string;
  companyName?: string;
  siret?: string;
  purpose?: string;
  user?: {
    fullName: string;
    email: string;
    phone?: string;
  };
  documents?: Array<{
    id: string;
    fileName: string;
    status: string;
  }>;
}

export default function AdminDashboard() {
  const { data: applications, isLoading } = usePendingLoanApplications();
  const { toast } = useToast();
  const approveMutation = useApproveLoanApplication();
  const rejectMutation = useRejectLoanApplication();
  const requestInfoMutation = useRequestMoreInfo();

  const [selectedApp, setSelectedApp] = useState<LoanApplicationWithUser | null>(null);
  const [actionDialog, setActionDialog] = useState<'approve' | 'reject' | 'request' | null>(null);
  const [message, setMessage] = useState('');

  const handleAction = async () => {
    if (!selectedApp) return;

    try {
      if (actionDialog === 'approve') {
        await approveMutation.mutateAsync({ id: selectedApp.id, message });
        toast({
          title: "Demande approuvée",
          description: "La demande a été approuvée avec succès.",
        });
      } else if (actionDialog === 'reject') {
        await rejectMutation.mutateAsync({ id: selectedApp.id, reason: message });
        toast({
          title: "Demande rejetée",
          description: "La demande a été rejetée.",
          variant: "destructive",
        });
      } else if (actionDialog === 'request') {
        await requestInfoMutation.mutateAsync({ id: selectedApp.id, message });
        toast({
          title: "Information demandée",
          description: "Une demande d'information a été envoyée à l'utilisateur.",
        });
      }
      setActionDialog(null);
      setMessage('');
      setSelectedApp(null);
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Une erreur est survenue",
        variant: "destructive",
      });
    }
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, any> = {
      pending: { variant: "secondary", icon: Clock, text: "En attente" },
      under_review: { variant: "default", icon: AlertCircle, text: "En cours" },
      approved: { variant: "default", icon: CheckCircle, text: "Approuvée" },
      rejected: { variant: "destructive", icon: XCircle, text: "Rejetée" },
    };
    const config = variants[status] || variants.pending;
    const Icon = config.icon;
    return (
      <Badge variant={config.variant} className="gap-1">
        <Icon className="h-3 w-3" />
        {config.text}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-muted-foreground">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen p-4 sm:p-6">
      <div className="space-y-1 mb-6">
        <h1 className="text-3xl font-bold">Dashboard Administrateur</h1>
        <p className="text-muted-foreground">
          Gérez les demandes de prêt et les documents
        </p>
      </div>

      <Tabs defaultValue="pending" className="flex-1">
        <TabsList>
          <TabsTrigger value="pending" data-testid="tab-pending">
            En attente ({applications?.filter(a => a.status === 'pending').length || 0})
          </TabsTrigger>
          <TabsTrigger value="under_review" data-testid="tab-review">
            En cours ({applications?.filter(a => a.status === 'under_review').length || 0})
          </TabsTrigger>
          <TabsTrigger value="all" data-testid="tab-all">
            Toutes
          </TabsTrigger>
        </TabsList>

        {['pending', 'under_review', 'all'].map(tab => (
          <TabsContent key={tab} value={tab} className="space-y-4">
            <div className="grid gap-4">
              {(applications as LoanApplicationWithUser[] | undefined)
                ?.filter((a: LoanApplicationWithUser) => tab === 'all' || a.status === tab)
                .map((app: LoanApplicationWithUser) => (
                  <Card key={app.id} className="hover-elevate" data-testid={`card-application-${app.id}`}>
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4 flex-wrap">
                        <div className="space-y-1">
                          <CardTitle className="flex items-center gap-2 flex-wrap">
                            <User className="h-5 w-5" />
                            {app.user?.fullName || 'Utilisateur'}
                            {getStatusBadge(app.status)}
                          </CardTitle>
                          <CardDescription>
                            {app.applicationType === 'particular' ? 'Particulier' : 'Professionnel'} • 
                            Soumis le {new Date(app.submittedAt).toLocaleDateString('fr-FR')}
                          </CardDescription>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-primary">
                            {parseFloat(app.amount).toLocaleString('fr-FR')} €
                          </div>
                          <div className="text-sm text-muted-foreground">
                            {app.durationMonths} mois
                          </div>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="font-medium">Email:</span> {app.user?.email}
                        </div>
                        <div>
                          <span className="font-medium">Téléphone:</span> {app.user?.phone || 'Non renseigné'}
                        </div>
                        {app.applicationType === 'particular' ? (
                          <>
                            <div>
                              <span className="font-medium">Revenu mensuel:</span> {parseFloat(app.monthlyIncome).toLocaleString('fr-FR')} €
                            </div>
                            <div>
                              <span className="font-medium">Statut emploi:</span> {app.employmentStatus}
                            </div>
                          </>
                        ) : (
                          <>
                            <div>
                              <span className="font-medium">Entreprise:</span> {app.companyName}
                            </div>
                            <div>
                              <span className="font-medium">SIRET:</span> {app.siret}
                            </div>
                          </>
                        )}
                      </div>

                      {app.purpose && (
                        <div>
                          <span className="font-medium text-sm">Projet:</span>
                          <p className="text-sm text-muted-foreground mt-1">{app.purpose}</p>
                        </div>
                      )}

                      {app.documents && app.documents.length > 0 && (
                        <div>
                          <span className="font-medium text-sm">Documents ({app.documents.length}):</span>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {app.documents.map((doc) => (
                              <Badge 
                                key={doc.id} 
                                variant={doc.status === 'approved' ? 'default' : doc.status === 'rejected' ? 'destructive' : 'secondary'}
                                className="gap-1"
                              >
                                <FileText className="h-3 w-3" />
                                {doc.fileName}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      )}

                      <div className="flex gap-2 flex-wrap">
                        <Button
                          variant="default"
                          size="sm"
                          onClick={() => {
                            setSelectedApp(app);
                            setActionDialog('approve');
                          }}
                          disabled={app.status === 'approved'}
                          data-testid="button-approve"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Approuver
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => {
                            setSelectedApp(app);
                            setActionDialog('reject');
                          }}
                          disabled={app.status === 'rejected'}
                          data-testid="button-reject"
                        >
                          <XCircle className="h-4 w-4 mr-1" />
                          Rejeter
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedApp(app);
                            setActionDialog('request');
                          }}
                          data-testid="button-request-info"
                        >
                          <MessageSquare className="h-4 w-4 mr-1" />
                          Demander info
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>

      <Dialog open={!!actionDialog} onOpenChange={() => {
        setActionDialog(null);
        setMessage('');
        setSelectedApp(null);
      }}>
        <DialogContent data-testid="dialog-action">
          <DialogHeader>
            <DialogTitle>
              {actionDialog === 'approve' && 'Approuver la demande'}
              {actionDialog === 'reject' && 'Rejeter la demande'}
              {actionDialog === 'request' && 'Demander des informations'}
            </DialogTitle>
            <DialogDescription>
              Demande de {selectedApp?.user?.fullName} pour {parseFloat(selectedApp?.amount || 0).toLocaleString('fr-FR')} €
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="message">
                {actionDialog === 'reject' ? 'Motif du rejet *' : 'Message (optionnel)'}
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={
                  actionDialog === 'reject' 
                    ? 'Expliquez la raison du rejet...' 
                    : actionDialog === 'request'
                    ? 'Quelles informations supplémentaires souhaitez-vous ?'
                    : 'Message de félicitations (optionnel)'
                }
                data-testid="textarea-message"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setActionDialog(null);
              setMessage('');
              setSelectedApp(null);
            }}>
              Annuler
            </Button>
            <Button
              onClick={handleAction}
              disabled={(actionDialog === 'reject' && !message) || approveMutation.isPending || rejectMutation.isPending || requestInfoMutation.isPending}
              variant={actionDialog === 'reject' ? 'destructive' : 'default'}
              data-testid="button-confirm-action"
            >
              Confirmer
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
