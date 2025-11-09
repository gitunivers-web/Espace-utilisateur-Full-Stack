import { db } from "./db";
import { loanTypes } from "@shared/schema";

const demoLoanTypes = [
  {
    name: "Prêt Personnel",
    category: "particular",
    description: "Financement rapide pour vos projets personnels sans justificatif d'utilisation",
    minAmount: "500",
    maxAmount: "75000",
    minDurationMonths: 6,
    maxDurationMonths: 84,
    minRate: "0.5",
    maxRate: "9.9",
    features: [
      "Réponse sous 48h",
      "100% en ligne",
      "Sans frais de dossier",
      "Remboursement anticipé gratuit"
    ],
    active: true
  },
  {
    name: "Crédit Auto",
    category: "particular",
    description: "Financez l'achat de votre véhicule neuf ou d'occasion",
    minAmount: "3000",
    maxAmount: "50000",
    minDurationMonths: 12,
    maxDurationMonths: 84,
    minRate: "1.0",
    maxRate: "7.5",
    features: [
      "Taux compétitifs",
      "Jusqu'à 7 ans de remboursement",
      "Assurance incluse",
      "Report de première échéance possible"
    ],
    active: true
  },
  {
    name: "Prêt Travaux",
    category: "particular",
    description: "Réalisez vos projets de rénovation et d'amélioration de l'habitat",
    minAmount: "1000",
    maxAmount: "75000",
    minDurationMonths: 12,
    maxDurationMonths: 120,
    minRate: "1.5",
    maxRate: "8.0",
    features: [
      "Financement jusqu'à 75 000€",
      "Déblocage progressif des fonds",
      "Taux avantageux",
      "Accompagnement personnalisé"
    ],
    active: true
  },
  {
    name: "Crédit Immobilier Professionnel",
    category: "professional",
    description: "Financez l'achat de vos locaux commerciaux, bureaux ou entrepôts",
    minAmount: "50000",
    maxAmount: "2000000",
    minDurationMonths: 60,
    maxDurationMonths: 240,
    minRate: "3.6",
    maxRate: "3.9",
    features: [
      "Taux fixes de 3,6% à 3,9%",
      "Durée jusqu'à 20 ans",
      "Financement jusqu'à 80% du projet",
      "Garantie BPI France possible",
      "Frais de dossier réduits"
    ],
    active: true
  },
  {
    name: "Prêt Création d'Entreprise",
    category: "professional",
    description: "Financez le démarrage de votre activité avec un accompagnement personnalisé",
    minAmount: "5000",
    maxAmount: "150000",
    minDurationMonths: 24,
    maxDurationMonths: 84,
    minRate: "3.5",
    maxRate: "5.5",
    features: [
      "Sans garantie avec BPI France",
      "Apport personnel à partir de 20%",
      "Période de différé possible",
      "Conseiller dédié",
      "Taux d'acceptation 97%"
    ],
    active: true
  },
  {
    name: "Crédit Trésorerie Pro",
    category: "professional",
    description: "Optimisez votre besoin en fonds de roulement avec une solution flexible",
    minAmount: "1000",
    maxAmount: "100000",
    minDurationMonths: 3,
    maxDurationMonths: 36,
    minRate: "4.29",
    maxRate: "5.4",
    features: [
      "Déblocage en 48h",
      "Taux moyen 4,29%",
      "Utilisation flexible",
      "Remboursement adapté à votre activité",
      "Ligne de crédit renouvelable"
    ],
    active: true
  },
  {
    name: "Financement Équipement",
    category: "professional",
    description: "Équipez votre entreprise en machines, véhicules ou matériel informatique",
    minAmount: "2000",
    maxAmount: "300000",
    minDurationMonths: 12,
    maxDurationMonths: 60,
    minRate: "3.7",
    maxRate: "3.73",
    features: [
      "Taux exceptionnels dès 3,7%",
      "Financement jusqu'à 100%",
      "Durée adaptée à l'amortissement",
      "Déduction fiscale des intérêts",
      "Option crédit-bail disponible"
    ],
    active: true
  },
  {
    name: "Rachat de Fonds de Commerce",
    category: "professional",
    description: "Reprenez une activité existante avec un financement sur-mesure",
    minAmount: "20000",
    maxAmount: "500000",
    minDurationMonths: 36,
    maxDurationMonths: 120,
    minRate: "4.1",
    maxRate: "4.7",
    features: [
      "Financement du fonds et des stocks",
      "Étude personnalisée du dossier",
      "Apport personnel minimum 30%",
      "Accompagnement dans la reprise",
      "Crédit vendeur possible"
    ],
    active: true
  },
  {
    name: "Prêt Investissement PME",
    category: "professional",
    description: "Développez votre entreprise : nouveaux locaux, expansion, digitalisation",
    minAmount: "10000",
    maxAmount: "500000",
    minDurationMonths: 24,
    maxDurationMonths: 84,
    minRate: "3.54",
    maxRate: "4.55",
    features: [
      "Taux PME préférentiels",
      "Garantie BPI France jusqu'à 90%",
      "Montants adaptés à votre projet",
      "Sans caution personnelle possible",
      "Financement de la croissance"
    ],
    active: true
  },
  {
    name: "Crédit-Bail Professionnel",
    category: "professional",
    description: "Louez votre équipement avec option d'achat en fin de contrat",
    minAmount: "5000",
    maxAmount: "250000",
    minDurationMonths: 24,
    maxDurationMonths: 60,
    minRate: "3.8",
    maxRate: "4.5",
    features: [
      "Préservation de la trésorerie",
      "Loyers déductibles fiscalement",
      "Option d'achat en fin de contrat",
      "Renouvellement du matériel facilité",
      "Pas d'apport initial requis"
    ],
    active: true
  }
];

async function seedLoanTypes() {
  console.log("Seeding loan types...");
  
  try {
    for (const loanType of demoLoanTypes) {
      await db.insert(loanTypes).values(loanType);
      console.log(`✓ Added: ${loanType.name}`);
    }
    console.log("\n✅ All loan types have been seeded successfully!");
  } catch (error) {
    console.error("Error seeding loan types:", error);
  }
}

seedLoanTypes();
