import { DocumentUpload } from "@/components/loan/DocumentUpload";
import type { LoanApplication } from "@shared/schema";

interface StepDocumentsProps {
  applicationType: "particular" | "professional";
  loanApplicationId?: string;
  onDocumentsUploaded?: (hasAllRequired: boolean) => void;
}

export function StepDocuments({ 
  applicationType, 
  loanApplicationId,
  onDocumentsUploaded 
}: StepDocumentsProps) {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-bold">Documents justificatifs</h2>
        <p className="text-muted-foreground">
          Pour finaliser votre demande, veuillez télécharger les documents requis ci-dessous.
          Tous les documents marqués d'un astérisque (*) sont obligatoires.
        </p>
      </div>

      <DocumentUpload
        loanApplicationId={loanApplicationId}
        applicationType={applicationType}
        onDocumentsChange={(documents) => {
          const requiredTypes = applicationType === "particular"
            ? ["identity", "proof_of_address", "income_proof"]
            : ["identity", "company_registration", "tax_return", "bank_statement"];

          const uploadedTypes = documents.map(d => d.type);
          const hasAllRequired = requiredTypes.every(type => uploadedTypes.includes(type as any));
          
          onDocumentsUploaded?.(hasAllRequired);
        }}
      />
    </div>
  );
}
