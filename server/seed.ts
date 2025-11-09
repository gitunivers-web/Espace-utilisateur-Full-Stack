import { storage } from "./storage";

async function seed() {
  console.log("🌱 Seeding database...");

  // Create loan types
  const loanTypesData = [
    {
      id: "personnel",
      name: "Prêt Personnel",
      description: "Financement pour vos projets personnels",
      category: "particulier",
      minAmount: "1000",
      maxAmount: "75000",
      minDurationMonths: 12,
      maxDurationMonths: 84,
      minRate: "2.9",
      maxRate: "7.5",
      features: [
        "Taux fixe compétitif",
        "Réponse sous 24h",
        "Remboursement anticipé sans frais",
        "Assurance emprunteur incluse"
      ],
      active: true
    },
    {
      id: "auto",
      name: "Crédit Auto",
      description: "Financez votre véhicule neuf ou d'occasion",
      category: "particulier",
      minAmount: "5000",
      maxAmount: "75000",
      minDurationMonths: 12,
      maxDurationMonths: 72,
      minRate: "1.9",
      maxRate: "5.9",
      features: [
        "Taux préférentiel",
        "Report de première mensualité possible",
        "Assurance perte d'emploi",
        "Déblocage rapide des fonds"
      ],
      active: true
    },
    {
      id: "travaux",
      name: "Prêt Travaux",
      description: "Rénovez et améliorez votre habitat",
      category: "particulier",
      minAmount: "3000",
      maxAmount: "75000",
      minDurationMonths: 12,
      maxDurationMonths: 120,
      minRate: "2.5",
      maxRate: "6.9",
      features: [
        "Prêt affecté ou non affecté",
        "Accompagnement personnalisé",
        "Déblocage progressif possible",
        "Éco-prêt à taux réduit disponible"
      ],
      active: true
    },
    {
      id: "pro",
      name: "Prêt Professionnel",
      description: "Solutions de financement pour votre entreprise",
      category: "professionnel",
      minAmount: "10000",
      maxAmount: "500000",
      minDurationMonths: 12,
      maxDurationMonths: 84,
      minRate: "2.2",
      maxRate: "6.5",
      features: [
        "Financement d'équipement",
        "Trésorerie entreprise",
        "Accompagnement par un conseiller dédié",
        "Conditions adaptées à votre activité"
      ],
      active: true
    },
    {
      id: "immobilier",
      name: "Crédit Immobilier",
      description: "Achat de résidence principale ou investissement locatif",
      category: "particulier",
      minAmount: "50000",
      maxAmount: "500000",
      minDurationMonths: 84,
      maxDurationMonths: 300,
      minRate: "3.2",
      maxRate: "4.8",
      features: [
        "Taux fixe ou variable",
        "Accompagnement de A à Z",
        "Assurance emprunteur négociée",
        "Possibilité de moduler vos mensualités"
      ],
      active: true
    }
  ];

  for (const loanType of loanTypesData) {
    await storage.createLoanType(loanType);
  }

  console.log("✓ Loan types created:", loanTypesData.length);

  // Create user (password is "password123")
  const user = await storage.createUser({
    fullName: "Sophie Martin",
    email: "sophie.martin@altusfinance.fr",
    password: "$2b$10$LZU9IYfsRNDvYTTM20sqsuZI2mh45JsRQPt28h8B7w.d9Uuu688zu",
    phone: "+33 6 12 34 56 78",
    accountType: "pro",
  });

  console.log("✓ User created:", user.email);

  // Create accounts
  const account1 = await storage.createAccount({
    userId: user.id,
    name: "Compte Courant Pro",
    accountNumber: "FR76 3000 2034 5678 9012 3456 789",
    type: "Courant",
    balance: "48750.00",
  });

  const account2 = await storage.createAccount({
    userId: user.id,
    name: "Compte Épargne",
    accountNumber: "FR76 3000 2034 5678 9012 3456 790",
    type: "Épargne",
    balance: "125000.00",
  });

  console.log("✓ Accounts created:", account1.name, account2.name);

  // Create cards
  await storage.createCard({
    userId: user.id,
    accountId: account1.id,
    name: "Carte Business",
    cardNumber: "**** **** **** 4829",
    cardType: "Visa Premier",
    status: "active",
    expiryDate: "12/26",
  });

  await storage.createCard({
    userId: user.id,
    accountId: account1.id,
    name: "Carte Virtuelle",
    cardNumber: "**** **** **** 7312",
    cardType: "Mastercard",
    status: "active",
    expiryDate: "08/27",
  });

  console.log("✓ Cards created");

  // Create transactions
  const transactionsData = [
    {
      accountId: account1.id,
      description: "Virement - Client ABC Corp",
      amount: "15000",
      type: "credit",
      category: "Virement",
      status: "completed",
      date: new Date("2024-01-15"),
    },
    {
      accountId: account1.id,
      description: "Paiement fournisseur XYZ",
      amount: "-8500",
      type: "debit",
      category: "Achat",
      status: "completed",
      date: new Date("2024-01-14"),
    },
    {
      accountId: account1.id,
      description: "Remboursement prêt",
      amount: "-5000",
      type: "debit",
      category: "Prêt",
      status: "completed",
      date: new Date("2024-01-13"),
    },
    {
      accountId: account1.id,
      description: "Virement - Client DEF Ltd",
      amount: "22000",
      type: "credit",
      category: "Virement",
      status: "completed",
      date: new Date("2024-01-12"),
    },
    {
      accountId: account1.id,
      description: "Loyer bureaux",
      amount: "-3500",
      type: "debit",
      category: "Services",
      status: "pending",
      date: new Date("2024-01-11"),
    },
  ];

  for (const txn of transactionsData) {
    await storage.createTransaction(txn);
  }

  console.log("✓ Transactions created:", transactionsData.length);

  // Create loan
  await storage.createLoan({
    userId: user.id,
    name: "Prêt Professionnel",
    amount: "100000",
    borrowed: "97500",
    monthlyPayment: "5000",
    interestRate: "2.5",
    endDate: "2026-12-31",
    status: "active",
  });

  console.log("✓ Loan created");
  console.log("🎉 Database seeded successfully!");
}

seed().catch((error) => {
  console.error("❌ Seeding failed:", error);
  process.exit(1);
});
