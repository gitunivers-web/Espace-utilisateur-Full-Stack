import { useState, useEffect } from "react";
import { Upload, FileText, CheckCircle, XCircle, Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { Document } from "@shared/schema";

interface DocumentUploadProps {
  loanApplicationId?: string;
  applicationType: "particular" | "professional";
  onDocumentsChange?: (documents: Document[]) => void;
}

const DOCUMENT_TYPES = {
  particular: [
    { value: "identity", label: "Pièce d'identité", required: true },
    { value: "proof_of_address", label: "Justificatif de domicile", required: true },
    { value: "income_proof", label: "Justificatif de revenus", required: true },
  ],
  professional: [
    { value: "identity", label: "Pièce d'identité", required: true },
    { value: "company_registration", label: "Extrait KBIS", required: true },
    { value: "tax_return", label: "Déclaration fiscale", required: true },
    { value: "bank_statement", label: "Relevés bancaires (3 mois)", required: true },
  ],
} as const;

const STATUS_CONFIG = {
  pending: { label: "En attente", variant: "secondary" as const, icon: FileText },
  approved: { label: "Approuvé", variant: "default" as const, icon: CheckCircle },
  rejected: { label: "Rejeté", variant: "destructive" as const, icon: XCircle },
};

export function DocumentUpload({ loanApplicationId, applicationType, onDocumentsChange }: DocumentUploadProps) {
  const [uploading, setUploading] = useState<string | null>(null);
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const documentTypes = DOCUMENT_TYPES[applicationType];

  const { data: documents = [], refetch } = useQuery<Document[]>({
    queryKey: loanApplicationId ? ["/api/loan-applications", loanApplicationId, "documents"] : ["/api/documents/user"],
    enabled: !!loanApplicationId || true,
  });

  useEffect(() => {
    onDocumentsChange?.(documents);
  }, [documents, onDocumentsChange]);

  const handleFileUpload = async (type: string, file: File) => {
    setUploading(type);

    try {
      const existingDoc = getUploadedDocument(type);
      if (existingDoc) {
        await handleRemoveDocument(existingDoc.id);
      }

      const formData = new FormData();
      formData.append("document", file);
      formData.append("type", type);
      if (loanApplicationId) {
        formData.append("loanApplicationId", loanApplicationId);
      }

      const response = await fetch("/api/documents/upload", {
        method: "POST",
        body: formData,
        credentials: "include",
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || "Erreur lors du téléchargement");
      }

      const data = await response.json();
      
      if (data.success && data.document) {
        await refetch();
        
        toast({
          title: "Document téléchargé",
          description: "Votre document a été envoyé avec succès.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de télécharger le document",
        variant: "destructive",
      });
    } finally {
      setUploading(null);
    }
  };

  const handleRemoveDocument = async (docId: string) => {
    try {
      const response = await fetch(`/api/documents/${docId}`, {
        method: "DELETE",
        credentials: "include",
      });

      if (!response.ok) {
        throw new Error("Erreur lors de la suppression");
      }

      await refetch();
      
      toast({
        title: "Document supprimé",
        description: "Le document a été supprimé avec succès.",
      });
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Impossible de supprimer le document",
        variant: "destructive",
      });
    }
  };

  const getUploadedDocument = (type: string) => {
    return documents.find(doc => doc.type === type);
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <h3 className="text-lg font-medium">Documents justificatifs</h3>
        <p className="text-sm text-muted-foreground">
          Téléchargez les documents requis pour votre demande. Formats acceptés : PDF, JPG, PNG (max 10 Mo)
        </p>
      </div>

      <div className="space-y-3">
        {documentTypes.map((docType) => {
          const uploadedDoc = getUploadedDocument(docType.value);
          const isUploading = uploading === docType.value;
          const statusInfo = uploadedDoc ? STATUS_CONFIG[uploadedDoc.status] : null;

          return (
            <Card key={docType.value} data-testid={`document-card-${docType.value}`}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="font-medium text-sm">
                        {docType.label}
                        {docType.required && <span className="text-destructive ml-1">*</span>}
                      </p>
                      {uploadedDoc && statusInfo && (
                        <Badge variant={statusInfo.variant} className="gap-1" data-testid={`badge-status-${docType.value}`}>
                          <statusInfo.icon className="h-3 w-3" />
                          {statusInfo.label}
                        </Badge>
                      )}
                    </div>
                    {uploadedDoc && (
                      <p className="text-xs text-muted-foreground truncate mt-1">
                        {uploadedDoc.fileName}
                      </p>
                    )}
                    {uploadedDoc?.rejectionReason && (
                      <p className="text-xs text-destructive mt-1">
                        Motif : {uploadedDoc.rejectionReason}
                      </p>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    {uploadedDoc ? (
                      <>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => handleRemoveDocument(uploadedDoc.id)}
                          data-testid={`button-remove-${docType.value}`}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            const input = document.createElement("input");
                            input.type = "file";
                            input.accept = ".pdf,.jpg,.jpeg,.png";
                            input.onchange = (e) => {
                              const file = (e.target as HTMLInputElement).files?.[0];
                              if (file) handleFileUpload(docType.value, file);
                            };
                            input.click();
                          }}
                          disabled={isUploading}
                          data-testid={`button-replace-${docType.value}`}
                        >
                          Remplacer
                        </Button>
                      </>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          const input = document.createElement("input");
                          input.type = "file";
                          input.accept = ".pdf,.jpg,.jpeg,.png";
                          input.onchange = (e) => {
                            const file = (e.target as HTMLInputElement).files?.[0];
                            if (file) handleFileUpload(docType.value, file);
                          };
                          input.click();
                        }}
                        disabled={isUploading}
                        data-testid={`button-upload-${docType.value}`}
                      >
                        {isUploading ? (
                          <>
                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            Envoi...
                          </>
                        ) : (
                          <>
                            <Upload className="h-4 w-4 mr-2" />
                            Télécharger
                          </>
                        )}
                      </Button>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {documents.length > 0 && (
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <CheckCircle className="h-4 w-4" />
          <span data-testid="text-documents-count">
            {documents.length} document{documents.length > 1 ? "s" : ""} téléchargé{documents.length > 1 ? "s" : ""}
          </span>
        </div>
      )}
    </div>
  );
}
