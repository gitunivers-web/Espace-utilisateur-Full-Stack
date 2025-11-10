import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Progress } from "@/components/ui/progress";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { FileText, Download, Upload, CheckCircle, AlertCircle, Loader2, XCircle } from "lucide-react";
import type { Contract } from "@shared/schema";

interface ContractSigningProps {
  loanApplicationId: string;
}

const STATUS_CONFIG = {
  generated: { label: "Généré", variant: "secondary" as const, icon: FileText },
  sent: { label: "Envoyé", variant: "default" as const, icon: FileText },
  signed: { label: "Signé", variant: "default" as const, icon: CheckCircle },
  verified: { label: "Vérifié", variant: "default" as const, icon: CheckCircle },
  rejected: { label: "Rejeté", variant: "destructive" as const, icon: XCircle },
};

export function ContractSigning({ loanApplicationId }: ContractSigningProps) {
  const { toast } = useToast();
  const [isUploading, setIsUploading] = useState(false);

  const { data: contract, isLoading } = useQuery<Contract>({
    queryKey: ["/api/loan-applications", loanApplicationId, "contract"],
  });

  const uploadMutation = useMutation({
    mutationFn: async ({ file, contractId }: { file: File; contractId: string }) => {
      const formData = new FormData();
      formData.append("document", file);
      formData.append("type", "signed_contract");
      formData.append("loanApplicationId", loanApplicationId);

      const uploadResponse = await fetch("/api/documents/upload", {
        method: "POST",
        credentials: "include",
        body: formData,
      });

      if (!uploadResponse.ok) {
        const error = await uploadResponse.json();
        throw new Error(error.error || "Erreur lors de l'upload du document");
      }

      const { document: uploadedDoc } = await uploadResponse.json();

      const signResponse = await apiRequest(`/api/contracts/${contractId}/sign`, {
        method: "POST",
        body: JSON.stringify({ signedFileUrl: uploadedDoc.fileUrl }),
      });

      return signResponse;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/loan-applications", loanApplicationId, "contract"] });
      queryClient.invalidateQueries({ queryKey: ["/api/documents"] });
      toast({
        title: "Contrat signé",
        description: "Votre contrat signé a été envoyé avec succès. Il sera vérifié par notre équipe.",
      });
      setIsUploading(false);
    },
    onError: (error: Error) => {
      toast({
        title: "Erreur",
        description: error.message,
        variant: "destructive",
      });
      setIsUploading(false);
    },
  });

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!contract) {
      toast({
        title: "Erreur",
        description: "Contrat non disponible",
        variant: "destructive",
      });
      return;
    }

    if (file.type !== "application/pdf") {
      toast({
        title: "Erreur",
        description: "Seuls les fichiers PDF sont acceptés",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      toast({
        title: "Erreur",
        description: "Le fichier ne doit pas dépasser 10 Mo",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);
    uploadMutation.mutate({ file, contractId: contract.id });
  };

  const handleDownload = () => {
    if (!contract) return;
    window.open(`/api/contracts/${contract.id}/pdf`, "_blank");
  };

  if (isLoading) {
    return (
      <Card data-testid="card-contract-loading">
        <CardContent className="flex items-center justify-center p-12">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </CardContent>
      </Card>
    );
  }

  if (!contract) {
    return (
      <Alert data-testid="alert-no-contract">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Aucun contrat n'a encore été généré pour cette demande. Veuillez attendre l'approbation de votre demande.
        </AlertDescription>
      </Alert>
    );
  }

  const statusConfig = STATUS_CONFIG[contract.status];
  const Icon = statusConfig.icon;
  const canSign = contract.status === "generated" || contract.status === "sent" || contract.status === "rejected";
  const canUpload = canSign && !isUploading;

  return (
    <Card data-testid="card-contract-signing">
      <CardHeader>
        <div className="flex items-start justify-between gap-4 flex-wrap">
          <div>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Contrat de prêt
            </CardTitle>
            <CardDescription>
              Contrat N° {contract.contractNumber}
            </CardDescription>
          </div>
          <Badge variant={statusConfig.variant} data-testid={`badge-contract-status-${contract.status}`}>
            <Icon className="h-3 w-3 mr-1" />
            {statusConfig.label}
          </Badge>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="flex items-center justify-between p-4 bg-muted/50 rounded-md">
          <div>
            <p className="text-sm font-medium">Document original</p>
            <p className="text-xs text-muted-foreground mt-1">
              Téléchargez le contrat, signez-le et renvoyez-le
            </p>
          </div>
          <Button 
            onClick={handleDownload} 
            variant="outline"
            data-testid="button-download-contract"
          >
            <Download className="h-4 w-4 mr-2" />
            Télécharger
          </Button>
        </div>

        {contract.status === "rejected" && contract.rejectionReason && (
          <Alert variant="destructive" data-testid="alert-contract-rejected">
            <XCircle className="h-4 w-4" />
            <AlertDescription>
              <strong>Contrat rejeté :</strong> {contract.rejectionReason}
            </AlertDescription>
          </Alert>
        )}

        {canSign && (
          <div className="space-y-4">
            <div className="border-2 border-dashed rounded-md p-6 text-center">
              <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
              <h3 className="text-sm font-medium mb-2">
                {contract.status === "rejected" ? "Renvoyer le contrat signé" : "Envoyer le contrat signé"}
              </h3>
              <p className="text-xs text-muted-foreground mb-4">
                Format PDF uniquement, max 10 Mo
              </p>
              <label htmlFor="signed-contract-upload">
                <Button 
                  variant="default" 
                  disabled={!canUpload}
                  onClick={() => document.getElementById("signed-contract-upload")?.click()}
                  data-testid="button-upload-signed-contract"
                >
                  {isUploading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Envoi en cours...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4 mr-2" />
                      Choisir un fichier
                    </>
                  )}
                </Button>
              </label>
              <input
                id="signed-contract-upload"
                type="file"
                accept="application/pdf"
                className="hidden"
                onChange={handleFileChange}
                disabled={!canUpload}
                data-testid="input-signed-contract-file"
              />
            </div>

            <Alert data-testid="alert-contract-instructions">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription className="text-xs">
                <strong>Instructions :</strong>
                <ol className="list-decimal list-inside mt-2 space-y-1">
                  <li>Téléchargez le contrat PDF ci-dessus</li>
                  <li>Imprimez-le et signez-le à la main, ou utilisez une signature électronique</li>
                  <li>Scannez le document signé ou convertissez-le en PDF</li>
                  <li>Téléchargez le fichier PDF signé</li>
                </ol>
              </AlertDescription>
            </Alert>
          </div>
        )}

        {contract.status === "signed" && (
          <Alert data-testid="alert-contract-pending-verification">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Votre contrat signé a été reçu et est en cours de vérification par notre équipe. 
              Vous serez notifié dès qu'il sera validé.
            </AlertDescription>
          </Alert>
        )}

        {contract.status === "verified" && (
          <Alert data-testid="alert-contract-verified">
            <CheckCircle className="h-4 w-4" />
            <AlertDescription>
              Votre contrat a été vérifié et validé. Le processus de transfert des fonds peut commencer.
            </AlertDescription>
          </Alert>
        )}

        {contract.signedAt && (
          <div className="text-sm text-muted-foreground">
            Signé le {new Date(contract.signedAt).toLocaleDateString("fr-FR")} à {new Date(contract.signedAt).toLocaleTimeString("fr-FR")}
          </div>
        )}

        {contract.verifiedAt && (
          <div className="text-sm text-muted-foreground">
            Vérifié le {new Date(contract.verifiedAt).toLocaleDateString("fr-FR")} à {new Date(contract.verifiedAt).toLocaleTimeString("fr-FR")}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
