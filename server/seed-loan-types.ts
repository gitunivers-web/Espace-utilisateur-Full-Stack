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
    name: "Prêt Professionnel",
    category: "professional",
    description: "Solution de financement adaptée aux besoins de votre entreprise",
    minAmount: "5000",
    maxAmount: "500000",
    minDurationMonths: 12,
    maxDurationMonths: 84,
    minRate: "2.0",
    maxRate: "6.5",
    features: [
      "Montants jusqu'à 500 000€",
      "Taux préférentiels",
      "Accompagnement dédié",
      "Fiscalité avantageuse"
    ],
    active: true
  },
  {
    name: "Crédit Trésorerie",
    category: "professional",
    description: "Optimisez la gestion de votre trésorerie avec une solution flexible",
    minAmount: "1000",
    maxAmount: "100000",
    minDurationMonths: 3,
    maxDurationMonths: 36,
    minRate: "3.0",
    maxRate: "8.0",
    features: [
      "Déblocage rapide",
      "Utilisation flexible",
      "Remboursement adapté",
      "Renouvelable"
    ],
    active: true
  },
  {
    name: "Financement Équipement",
    category: "professional",
    description: "Équipez votre entreprise sans impacter votre trésorerie",
    minAmount: "2000",
    maxAmount: "300000",
    minDurationMonths: 12,
    maxDurationMonths: 60,
    minRate: "1.8",
    maxRate: "5.5",
    features: [
      "Financement jusqu'à 100% du matériel",
      "Durée adaptée à l'amortissement",
      "Option location avec option d'achat",
      "Avantages fiscaux"
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
