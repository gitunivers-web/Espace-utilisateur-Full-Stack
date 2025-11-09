import { Router } from "express";
import { db } from "./db";
import { loanTypes } from "@shared/schema";

export const seedRouter = Router();

const loanTypesData = [
  // === PARTICULIERS ===
  {
    slug: "pret-personnel",
    nameKey: "loanTypes.personal.name",
    descriptionKey: "loanTypes.personal.description",
    category: "particular",
    minAmount: "500",
    maxAmount: "75000",
    minDurationMonths: 6,
    maxDurationMonths: 84,
    minRate: "0.90",
    maxRate: "9.49",
    featureKeys: [
      "loanTypes.personal.features.noproof",
      "loanTypes.personal.features.freeuse",
      "loanTypes.personal.features.fastresponse",
      "loanTypes.personal.features.earlyrepayment"
    ],
    active: true,
  },
  {
    slug: "credit-auto",
    nameKey: "loanTypes.auto.name",
    descriptionKey: "loanTypes.auto.description",
    category: "particular",
    minAmount: "1000",
    maxAmount: "75000",
    minDurationMonths: 12,
    maxDurationMonths: 84,
    minRate: "0.90",
    maxRate: "8.71",
    featureKeys: [
      "loanTypes.auto.features.newused",
      "loanTypes.auto.features.zerodownpayment",
      "loanTypes.auto.features.dedicated",
      "loanTypes.auto.features.insurance"
    ],
    active: true,
  },
  {
    slug: "credit-moto",
    nameKey: "loanTypes.motorcycle.name",
    descriptionKey: "loanTypes.motorcycle.description",
    category: "particular",
    minAmount: "500",
    maxAmount: "50000",
    minDurationMonths: 6,
    maxDurationMonths: 72,
    minRate: "1.99",
    maxRate: "8.50",
    featureKeys: [
      "loanTypes.motorcycle.features.allbrands",
      "loanTypes.motorcycle.features.newused",
      "loanTypes.motorcycle.features.equipment",
      "loanTypes.motorcycle.features.fastapproval"
    ],
    active: true,
  },
  {
    slug: "pret-travaux",
    nameKey: "loanTypes.home.name",
    descriptionKey: "loanTypes.home.description",
    category: "particular",
    minAmount: "1000",
    maxAmount: "75000",
    minDurationMonths: 12,
    maxDurationMonths: 120,
    minRate: "2.50",
    maxRate: "7.90",
    featureKeys: [
      "loanTypes.home.features.renovation",
      "loanTypes.home.features.energytransition",
      "loanTypes.home.features.taxcredit",
      "loanTypes.home.features.longerterm"
    ],
    active: true,
  },
  
  // === PROFESSIONNELS ===
  {
    slug: "pret-professionnel",
    nameKey: "loanTypes.business.name",
    descriptionKey: "loanTypes.business.description",
    category: "professional",
    minAmount: "10000",
    maxAmount: "500000",
    minDurationMonths: 12,
    maxDurationMonths: 84,
    minRate: "2.50",
    maxRate: "6.50",
    featureKeys: [
      "loanTypes.business.features.development",
      "loanTypes.business.features.bpibackup",
      "loanTypes.business.features.nodownpayment",
      "loanTypes.business.features.taxdeductible"
    ],
    active: true,
  },
  {
    slug: "credit-tresorerie",
    nameKey: "loanTypes.cashflow.name",
    descriptionKey: "loanTypes.cashflow.description",
    category: "professional",
    minAmount: "5000",
    maxAmount: "250000",
    minDurationMonths: 3,
    maxDurationMonths: 36,
    minRate: "2.00",
    maxRate: "7.00",
    featureKeys: [
      "loanTypes.cashflow.features.quickaccess",
      "loanTypes.cashflow.features.flexible",
      "loanTypes.cashflow.features.seasonal",
      "loanTypes.cashflow.features.renewable"
    ],
    active: true,
  },
  {
    slug: "financement-equipement",
    nameKey: "loanTypes.equipment.name",
    descriptionKey: "loanTypes.equipment.description",
    category: "professional",
    minAmount: "10000",
    maxAmount: "1000000",
    minDurationMonths: 12,
    maxDurationMonths: 84,
    minRate: "1.90",
    maxRate: "5.50",
    featureKeys: [
      "loanTypes.equipment.features.allequipment",
      "loanTypes.equipment.features.amortization",
      "loanTypes.equipment.features.assetbacked",
      "loanTypes.equipment.features.taxoptimized"
    ],
    active: true,
  },
  {
    slug: "credit-immobilier-pro",
    nameKey: "loanTypes.commercial.name",
    descriptionKey: "loanTypes.commercial.description",
    category: "professional",
    minAmount: "50000",
    maxAmount: "2000000",
    minDurationMonths: 60,
    maxDurationMonths: 240,
    minRate: "1.90",
    maxRate: "4.50",
    featureKeys: [
      "loanTypes.commercial.features.officewarehouse",
      "loanTypes.commercial.features.longterm",
      "loanTypes.commercial.features.fixedrate",
      "loanTypes.commercial.features.patrimony"
    ],
    active: true,
  },
  {
    slug: "creation-entreprise",
    nameKey: "loanTypes.startup.name",
    descriptionKey: "loanTypes.startup.description",
    category: "professional",
    minAmount: "5000",
    maxAmount: "150000",
    minDurationMonths: 12,
    maxDurationMonths: 60,
    minRate: "2.50",
    maxRate: "7.50",
    featureKeys: [
      "loanTypes.startup.features.zerotothree",
      "loanTypes.startup.features.honorguarantee",
      "loanTypes.startup.features.bpisupport",
      "loanTypes.startup.features.deferredpayment"
    ],
    active: true,
  },
  {
    slug: "reprise-entreprise",
    nameKey: "loanTypes.acquisition.name",
    descriptionKey: "loanTypes.acquisition.description",
    category: "professional",
    minAmount: "20000",
    maxAmount: "1000000",
    minDurationMonths: 24,
    maxDurationMonths: 120,
    minRate: "2.80",
    maxRate: "6.80",
    featureKeys: [
      "loanTypes.acquisition.features.fullacquisition",
      "loanTypes.acquisition.features.equity",
      "loanTypes.acquisition.features.guarantee",
      "loanTypes.acquisition.features.structured"
    ],
    active: true,
  },
];

seedRouter.post("/api/admin/seed-loan-types", async (req, res) => {
  try {
    console.log("🌱 Début du seed des types de prêts...");
    
    // Supprimer les types de prêts existants
    console.log("🗑️  Suppression des types de prêts existants...");
    await db.delete(loanTypes);
    
    // Insérer les nouveaux types de prêts
    console.log("📝 Insertion des nouveaux types de prêts...");
    for (const loanType of loanTypesData) {
      await db.insert(loanTypes).values(loanType);
      console.log(`✅ ${loanType.nameKey}`);
    }
    
    console.log(`\n✨ ${loanTypesData.length} types de prêts créés avec succès !`);
    
    res.json({
      success: true,
      message: `${loanTypesData.length} types de prêts créés avec succès`,
      details: {
        particuliers: loanTypesData.filter(l => l.category === "particular").length,
        professionnels: loanTypesData.filter(l => l.category === "professional").length,
      }
    });
    
  } catch (error) {
    console.error("❌ Erreur lors du seed:", error);
    res.status(500).json({ 
      success: false, 
      error: "Erreur lors du seed de la base de données",
      details: error instanceof Error ? error.message : String(error)
    });
  }
});
