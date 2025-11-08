import { storage } from "./storage";

async function seed() {
  console.log("🌱 Seeding database...");

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
