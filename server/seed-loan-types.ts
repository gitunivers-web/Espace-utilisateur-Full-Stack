import { db } from "./db";
import { loanTypes } from "@shared/schema";

const demoLoanTypes = [
  {
    slug: "pret-personnel",
    nameKey: "loanTypes.personal.name",
    descriptionKey: "loanTypes.personal.description",
    category: "particular",
    minAmount: "1000",
    maxAmount: "40000",
    minDurationMonths: 6,
    maxDurationMonths: 84,
    minRate: "4.5",
    maxRate: "8.5",
    featureKeys: [
      "loanTypes.personal.feature1",
      "loanTypes.personal.feature2",
      "loanTypes.personal.feature3",
      "loanTypes.personal.feature4"
    ],
    active: true
  },
  {
    slug: "credit-auto",
    nameKey: "loanTypes.auto.name",
    descriptionKey: "loanTypes.auto.description",
    category: "particular",
    minAmount: "3000",
    maxAmount: "50000",
    minDurationMonths: 12,
    maxDurationMonths: 84,
    minRate: "3.9",
    maxRate: "7.5",
    featureKeys: [
      "loanTypes.auto.feature1",
      "loanTypes.auto.feature2",
      "loanTypes.auto.feature3",
      "loanTypes.auto.feature4"
    ],
    active: true
  },
  {
    slug: "pret-travaux",
    nameKey: "loanTypes.renovation.name",
    descriptionKey: "loanTypes.renovation.description",
    category: "particular",
    minAmount: "1000",
    maxAmount: "75000",
    minDurationMonths: 12,
    maxDurationMonths: 120,
    minRate: "3.8",
    maxRate: "8.0",
    featureKeys: [
      "loanTypes.renovation.feature1",
      "loanTypes.renovation.feature2",
      "loanTypes.renovation.feature3",
      "loanTypes.renovation.feature4"
    ],
    active: true
  },
  {
    slug: "pret-etudiant",
    nameKey: "loanTypes.student.name",
    descriptionKey: "loanTypes.student.description",
    category: "particular",
    minAmount: "1000",
    maxAmount: "50000",
    minDurationMonths: 12,
    maxDurationMonths: 120,
    minRate: "0.9",
    maxRate: "2.5",
    featureKeys: [
      "loanTypes.student.feature1",
      "loanTypes.student.feature2",
      "loanTypes.student.feature3",
      "loanTypes.student.feature4"
    ],
    active: true
  },
  {
    slug: "pret-amortissable-pro",
    nameKey: "loanTypes.businessLoan.name",
    descriptionKey: "loanTypes.businessLoan.description",
    category: "professional",
    minAmount: "10000",
    maxAmount: "500000",
    minDurationMonths: 24,
    maxDurationMonths: 180,
    minRate: "3.2",
    maxRate: "5.5",
    featureKeys: [
      "loanTypes.businessLoan.feature1",
      "loanTypes.businessLoan.feature2",
      "loanTypes.businessLoan.feature3",
      "loanTypes.businessLoan.feature4"
    ],
    active: true
  },
  {
    slug: "credit-bail",
    nameKey: "loanTypes.leasing.name",
    descriptionKey: "loanTypes.leasing.description",
    category: "professional",
    minAmount: "5000",
    maxAmount: "250000",
    minDurationMonths: 24,
    maxDurationMonths: 60,
    minRate: "3.8",
    maxRate: "5.0",
    featureKeys: [
      "loanTypes.leasing.feature1",
      "loanTypes.leasing.feature2",
      "loanTypes.leasing.feature3",
      "loanTypes.leasing.feature4"
    ],
    active: true
  },
  {
    slug: "avance-tresorerie",
    nameKey: "loanTypes.cashAdvance.name",
    descriptionKey: "loanTypes.cashAdvance.description",
    category: "professional",
    minAmount: "1000",
    maxAmount: "100000",
    minDurationMonths: 3,
    maxDurationMonths: 36,
    minRate: "4.0",
    maxRate: "6.5",
    featureKeys: [
      "loanTypes.cashAdvance.feature1",
      "loanTypes.cashAdvance.feature2",
      "loanTypes.cashAdvance.feature3",
      "loanTypes.cashAdvance.feature4"
    ],
    active: true
  },
  {
    slug: "immobilier-pro",
    nameKey: "loanTypes.commercialRealEstate.name",
    descriptionKey: "loanTypes.commercialRealEstate.description",
    category: "professional",
    minAmount: "50000",
    maxAmount: "2000000",
    minDurationMonths: 60,
    maxDurationMonths: 240,
    minRate: "1.9",
    maxRate: "3.9",
    featureKeys: [
      "loanTypes.commercialRealEstate.feature1",
      "loanTypes.commercialRealEstate.feature2",
      "loanTypes.commercialRealEstate.feature3",
      "loanTypes.commercialRealEstate.feature4"
    ],
    active: true
  },
  {
    slug: "equipement-pro",
    nameKey: "loanTypes.equipment.name",
    descriptionKey: "loanTypes.equipment.description",
    category: "professional",
    minAmount: "2000",
    maxAmount: "300000",
    minDurationMonths: 12,
    maxDurationMonths: 60,
    minRate: "3.5",
    maxRate: "5.2",
    featureKeys: [
      "loanTypes.equipment.feature1",
      "loanTypes.equipment.feature2",
      "loanTypes.equipment.feature3",
      "loanTypes.equipment.feature4"
    ],
    active: true
  },
  {
    slug: "creation-entreprise",
    nameKey: "loanTypes.startup.name",
    descriptionKey: "loanTypes.startup.description",
    category: "professional",
    minAmount: "5000",
    maxAmount: "150000",
    minDurationMonths: 24,
    maxDurationMonths: 84,
    minRate: "3.5",
    maxRate: "5.5",
    featureKeys: [
      "loanTypes.startup.feature1",
      "loanTypes.startup.feature2",
      "loanTypes.startup.feature3",
      "loanTypes.startup.feature4"
    ],
    active: true
  }
];

async function seedLoanTypes() {
  console.log("Seeding loan types...");
  
  try {
    for (const loanType of demoLoanTypes) {
      await db.insert(loanTypes).values(loanType);
      console.log(`✓ Added: ${loanType.slug}`);
    }
    console.log("\n✅ All loan types have been seeded successfully!");
  } catch (error) {
    console.error("Error seeding loan types:", error);
  }
}

seedLoanTypes();
