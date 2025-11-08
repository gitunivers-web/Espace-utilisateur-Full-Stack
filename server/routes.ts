import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import {
  insertUserSchema,
  insertAccountSchema,
  insertCardSchema,
  insertTransactionSchema,
  insertLoanSchema,
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get current user (hardcoded for now - would be from session/auth later)
  app.get("/api/user", async (req, res) => {
    try {
      const users = await storage.getUserByEmail("sophie.martin@altusfinance.fr");
      if (!users) {
        return res.status(404).json({ error: "User not found" });
      }
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update user profile
  app.patch("/api/user", async (req, res) => {
    try {
      const user = await storage.getUserByEmail("sophie.martin@altusfinance.fr");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const updates = insertUserSchema.partial().parse(req.body);
      const updated = await storage.updateUser(user.id, updates);
      res.json(updated);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get all accounts for current user
  app.get("/api/accounts", async (req, res) => {
    try {
      const user = await storage.getUserByEmail("sophie.martin@altusfinance.fr");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const accounts = await storage.getAccountsByUserId(user.id);
      res.json(accounts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get single account
  app.get("/api/accounts/:id", async (req, res) => {
    try {
      const account = await storage.getAccount(req.params.id);
      if (!account) {
        return res.status(404).json({ error: "Account not found" });
      }
      res.json(account);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create new account
  app.post("/api/accounts", async (req, res) => {
    try {
      const user = await storage.getUserByEmail("sophie.martin@altusfinance.fr");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const data = insertAccountSchema.parse({
        ...req.body,
        userId: user.id,
      });
      const account = await storage.createAccount(data);
      res.status(201).json(account);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get all cards for current user
  app.get("/api/cards", async (req, res) => {
    try {
      const user = await storage.getUserByEmail("sophie.martin@altusfinance.fr");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const cards = await storage.getCardsByUserId(user.id);
      res.json(cards);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create new card
  app.post("/api/cards", async (req, res) => {
    try {
      const user = await storage.getUserByEmail("sophie.martin@altusfinance.fr");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const data = insertCardSchema.parse({
        ...req.body,
        userId: user.id,
      });
      const card = await storage.createCard(data);
      res.status(201).json(card);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Update card
  app.patch("/api/cards/:id", async (req, res) => {
    try {
      const updates = insertCardSchema.partial().parse(req.body);
      const card = await storage.updateCard(req.params.id, updates);
      if (!card) {
        return res.status(404).json({ error: "Card not found" });
      }
      res.json(card);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get transactions for an account
  app.get("/api/transactions/:accountId", async (req, res) => {
    try {
      const transactions = await storage.getTransactionsByAccountId(req.params.accountId);
      res.json(transactions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create transaction
  app.post("/api/transactions", async (req, res) => {
    try {
      const data = insertTransactionSchema.parse(req.body);
      const transaction = await storage.createTransaction(data);

      // Update account balance
      const account = await storage.getAccount(data.accountId);
      if (account) {
        const currentBalance = parseFloat(account.balance);
        const amount = parseFloat(data.amount);
        const newBalance = (currentBalance + amount).toFixed(2);
        await storage.updateAccountBalance(data.accountId, newBalance);
      }

      res.status(201).json(transaction);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get all loans for current user
  app.get("/api/loans", async (req, res) => {
    try {
      const user = await storage.getUserByEmail("sophie.martin@altusfinance.fr");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const loans = await storage.getLoansByUserId(user.id);
      res.json(loans);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create loan
  app.post("/api/loans", async (req, res) => {
    try {
      const user = await storage.getUserByEmail("sophie.martin@altusfinance.fr");
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }

      const data = insertLoanSchema.parse({
        ...req.body,
        userId: user.id,
      });
      const loan = await storage.createLoan(data);
      res.status(201).json(loan);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Update loan
  app.patch("/api/loans/:id", async (req, res) => {
    try {
      const updates = insertLoanSchema.partial().parse(req.body);
      const loan = await storage.updateLoan(req.params.id, updates);
      if (!loan) {
        return res.status(404).json({ error: "Loan not found" });
      }
      res.json(loan);
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Transfer endpoint (creates two transactions)
  app.post("/api/transfers", async (req, res) => {
    try {
      const schema = z.object({
        fromAccountId: z.string(),
        toAccountNumber: z.string(),
        amount: z.string(),
        description: z.string(),
      });

      const { fromAccountId, toAccountNumber, amount, description } = schema.parse(req.body);

      // Create debit transaction for sender
      const debitTransaction = await storage.createTransaction({
        accountId: fromAccountId,
        description: description,
        amount: `-${amount}`,
        type: "debit",
        category: "Virement",
        status: "completed",
        date: new Date(),
      });

      // Update sender account balance
      const fromAccount = await storage.getAccount(fromAccountId);
      if (fromAccount) {
        const currentBalance = parseFloat(fromAccount.balance);
        const transferAmount = parseFloat(amount);
        const newBalance = (currentBalance - transferAmount).toFixed(2);
        await storage.updateAccountBalance(fromAccountId, newBalance);
      }

      res.status(201).json({ transaction: debitTransaction });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
