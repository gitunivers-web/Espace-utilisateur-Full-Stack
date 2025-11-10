// Simple translation map for loan type names and descriptions
// This provides French translations for the loan type keys used in the PDF contracts

export const loanTypeTranslations: Record<string, { name: string; description: string }> = {
  // Auto loans
  'loan.auto.new.name': { 
    name: 'Crédit Auto Neuf', 
    description: 'Financement pour l\'achat d\'un véhicule neuf' 
  },
  'loan.auto.used.name': { 
    name: 'Crédit Auto Occasion', 
    description: 'Financement pour l\'achat d\'un véhicule d\'occasion' 
  },
  'loan.auto.refinance.name': { 
    name: 'Rachat de Crédit Auto', 
    description: 'Refinancement de votre crédit automobile existant' 
  },
  
  // Real estate loans
  'loan.realestate.primary.name': { 
    name: 'Prêt Immobilier Résidence Principale', 
    description: 'Financement pour l\'achat de votre résidence principale' 
  },
  'loan.realestate.secondary.name': { 
    name: 'Prêt Immobilier Résidence Secondaire', 
    description: 'Financement pour l\'achat d\'une résidence secondaire' 
  },
  'loan.realestate.investment.name': { 
    name: 'Prêt Immobilier Investissement', 
    description: 'Financement pour un investissement locatif' 
  },
  'loan.realestate.construction.name': { 
    name: 'Prêt Construction', 
    description: 'Financement pour la construction d\'un bien immobilier' 
  },
  
  // Personal loans
  'loan.personal.projects.name': { 
    name: 'Prêt Personnel Projets', 
    description: 'Crédit pour la réalisation de vos projets personnels' 
  },
  'loan.personal.consolidation.name': { 
    name: 'Rachat de Crédits', 
    description: 'Regroupement de vos crédits en cours' 
  },
  'loan.personal.emergency.name': { 
    name: 'Crédit d\'Urgence', 
    description: 'Financement rapide pour faire face à un imprévu' 
  },
  
  // Professional loans
  'loan.professional.startup.name': { 
    name: 'Prêt Création d\'Entreprise', 
    description: 'Financement pour créer votre entreprise' 
  },
  'loan.professional.expansion.name': { 
    name: 'Prêt Développement', 
    description: 'Financement pour développer votre activité' 
  },
  'loan.professional.equipment.name': { 
    name: 'Crédit Équipement', 
    description: 'Financement pour l\'achat d\'équipements professionnels' 
  },
  'loan.professional.cashflow.name': { 
    name: 'Crédit Trésorerie', 
    description: 'Financement pour améliorer votre trésorerie' 
  },
};

export function translateLoanType(nameKey: string, descriptionKey?: string): { name: string; description: string } {
  // Try to find translation for nameKey
  const translation = loanTypeTranslations[nameKey];
  
  if (translation) {
    return translation;
  }
  
  // Fallback: Return the key as-is if no translation found
  return {
    name: nameKey.replace('loan.', '').replace('.name', '').split('.').map(
      word => word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' '),
    description: descriptionKey || 'Produit de financement Lendia'
  };
}
