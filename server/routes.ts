import type { Express, Request, Response, NextFunction } from "express";
import { createServer, type Server } from "http";
import bcrypt from "bcrypt";
import { storage } from "./storage";
import {
  insertUserSchema,
  insertAccountSchema,
  insertCardSchema,
  insertTransactionSchema,
  insertLoanSchema,
  registerUserSchema,
  loginUserSchema,
  createLoanApplicationSchema,
  type User,
  type UserWithoutPassword,
} from "@shared/schema";
import { z } from "zod";
import passport from "./auth";

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Non authentifié" });
}

function omitPassword(user: User): UserWithoutPassword {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth endpoints
  app.post("/api/auth/register", async (req, res) => {
    try {
      const data = registerUserSchema.parse(req.body);
      
      const existingUser = await storage.getUserByEmail(data.email);
      if (existingUser) {
        return res.status(400).json({ error: "Cet email est déjà utilisé" });
      }

      const hashedPassword = await bcrypt.hash(data.password, 10);
      
      const user = await storage.createUser({
        ...data,
        password: hashedPassword,
      });

      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ error: "Erreur lors de la connexion" });
        }
        res.status(201).json({ user: omitPassword(user) });
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.post("/api/auth/login", (req, res, next) => {
    try {
      loginUserSchema.parse(req.body);
    } catch (error: any) {
      return res.status(400).json({ error: error.message });
    }

    passport.authenticate("local", (err: any, user: User | false, info: any) => {
      if (err) {
        return res.status(500).json({ error: "Erreur lors de la connexion" });
      }
      
      if (!user) {
        return res.status(401).json({ error: info?.message || "Email ou mot de passe incorrect" });
      }

      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ error: "Erreur lors de la connexion" });
        }
        res.json({ user: omitPassword(user) });
      });
    })(req, res, next);
  });

  app.post("/api/auth/logout", (req, res) => {
    req.logout((err) => {
      if (err) {
        return res.status(500).json({ error: "Erreur lors de la déconnexion" });
      }
      res.json({ success: true });
    });
  });

  app.get("/api/auth/me", requireAuth, (req, res) => {
    res.json({ user: omitPassword(req.user as User) });
  });

  // Get current user
  app.get("/api/user", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      res.json(omitPassword(user));
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Update user profile
  app.patch("/api/user", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      
      if (req.body.password) {
        return res.status(400).json({ 
          error: "Pour changer votre mot de passe, veuillez utiliser l'endpoint dédié /api/auth/change-password" 
        });
      }

      const { password: _, ...allowedUpdates } = req.body;
      const updates = insertUserSchema.partial().omit({ password: true }).parse(allowedUpdates);
      const updated = await storage.updateUser(user.id, updates);
      res.json(omitPassword(updated!));
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Change password endpoint
  app.post("/api/auth/change-password", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const { currentPassword, newPassword } = z.object({
        currentPassword: z.string().min(1),
        newPassword: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
      }).parse(req.body);

      const isValid = await bcrypt.compare(currentPassword, user.password);
      if (!isValid) {
        return res.status(401).json({ error: "Mot de passe actuel incorrect" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10);
      await storage.updateUser(user.id, { password: hashedPassword });
      
      res.json({ success: true, message: "Mot de passe modifié avec succès" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get all accounts for current user
  app.get("/api/accounts", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const accounts = await storage.getAccountsByUserId(user.id);
      res.json(accounts);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get single account
  app.get("/api/accounts/:id", requireAuth, async (req, res) => {
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
  app.post("/api/accounts", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
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
  app.get("/api/cards", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const cards = await storage.getCardsByUserId(user.id);
      res.json(cards);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create new card
  app.post("/api/cards", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
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
  app.patch("/api/cards/:id", requireAuth, async (req, res) => {
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
  app.get("/api/transactions/:accountId", requireAuth, async (req, res) => {
    try {
      const transactions = await storage.getTransactionsByAccountId(req.params.accountId);
      res.json(transactions);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create transaction
  app.post("/api/transactions", requireAuth, async (req, res) => {
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
  app.get("/api/loans", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const loans = await storage.getLoansByUserId(user.id);
      res.json(loans);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create loan
  app.post("/api/loans", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
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
  app.patch("/api/loans/:id", requireAuth, async (req, res) => {
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
  app.post("/api/transfers", requireAuth, async (req, res) => {
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

  // Get monthly statistics
  app.get("/api/stats/monthly", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const accounts = await storage.getAccountsByUserId(user.id);
      const accountIds = accounts.map(acc => acc.id);

      const stats = await storage.getMonthlyStats(accountIds);
      res.json(stats);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get all active loan types (public)
  app.get("/api/loan-types", async (req, res) => {
    try {
      const { category } = req.query;
      const loanTypes = category && typeof category === 'string'
        ? await storage.getLoanTypesByCategory(category)
        : await storage.getAllActiveLoanTypes();
      
      // NOTE: Known issue with neon-http driver - PostgreSQL boolean fields 
      // may be incorrectly deserialized. For production, consider switching 
      // to the standard 'pg' driver instead of 'neon-http' for better type support.
      
      res.json(loanTypes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get loan type by id (public)
  app.get("/api/loan-types/:id", async (req, res) => {
    try {
      const loanType = await storage.getLoanType(req.params.id);
      if (!loanType) {
        return res.status(404).json({ error: "Type de prêt non trouvé" });
      }
      res.json(loanType);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Simulate loan (public)
  app.post("/api/loan-simulator", async (req, res) => {
    try {
      const schema = z.object({
        loanTypeId: z.string(),
        amount: z.number().positive(),
        durationMonths: z.number().int().positive(),
      });

      const { loanTypeId, amount, durationMonths } = schema.parse(req.body);

      const loanType = await storage.getLoanType(loanTypeId);
      if (!loanType) {
        return res.status(404).json({ error: "Type de prêt non trouvé" });
      }

      const minAmount = parseFloat(loanType.minAmount);
      const maxAmount = parseFloat(loanType.maxAmount);

      if (amount < minAmount || amount > maxAmount) {
        return res.status(400).json({ 
          error: `Le montant doit être entre ${minAmount}€ et ${maxAmount}€` 
        });
      }

      if (durationMonths < loanType.minDurationMonths || durationMonths > loanType.maxDurationMonths) {
        return res.status(400).json({ 
          error: `La durée doit être entre ${loanType.minDurationMonths} et ${loanType.maxDurationMonths} mois` 
        });
      }

      const minRate = parseFloat(loanType.minRate);
      const maxRate = parseFloat(loanType.maxRate);
      const avgRate = (minRate + maxRate) / 2;
      
      const monthlyRate = avgRate / 100 / 12;
      const monthlyPayment = amount * monthlyRate / (1 - Math.pow(1 + monthlyRate, -durationMonths));
      const totalCost = monthlyPayment * durationMonths;
      const totalInterest = totalCost - amount;
      const taeg = avgRate;

      res.json({
        amount,
        durationMonths,
        monthlyPayment: Math.round(monthlyPayment * 100) / 100,
        totalCost: Math.round(totalCost * 100) / 100,
        totalInterest: Math.round(totalInterest * 100) / 100,
        estimatedRate: avgRate,
        taeg,
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Get all loan applications for current user
  app.get("/api/loan-applications", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const applications = await storage.getLoanApplicationsByUserId(user.id);
      res.json(applications);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create loan application
  app.post("/api/loan-applications", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const validatedData = createLoanApplicationSchema.parse(req.body);

      const loanType = await storage.getLoanType(validatedData.loanTypeId);
      if (!loanType) {
        return res.status(404).json({ error: "Type de prêt non trouvé" });
      }

      const minAmount = parseFloat(loanType.minAmount);
      const maxAmount = parseFloat(loanType.maxAmount);

      if (validatedData.amount < minAmount || validatedData.amount > maxAmount) {
        return res.status(400).json({ 
          error: `Le montant doit être entre ${minAmount}€ et ${maxAmount}€` 
        });
      }

      if (validatedData.durationMonths < loanType.minDurationMonths || 
          validatedData.durationMonths > loanType.maxDurationMonths) {
        return res.status(400).json({ 
          error: `La durée doit être entre ${loanType.minDurationMonths} et ${loanType.maxDurationMonths} mois` 
        });
      }

      const application = await storage.createLoanApplication({
        userId: user.id,
        loanTypeId: validatedData.loanTypeId,
        applicationType: validatedData.applicationType,
        amount: validatedData.amount.toString(),
        durationMonths: validatedData.durationMonths,
        monthlyIncome: 'monthlyIncome' in validatedData ? validatedData.monthlyIncome.toString() : null,
        employmentStatus: 'employmentStatus' in validatedData ? validatedData.employmentStatus : null,
        purpose: validatedData.purpose,
        companyName: 'companyName' in validatedData ? validatedData.companyName : null,
        siret: 'siret' in validatedData ? validatedData.siret : null,
        companyRevenue: 'companyRevenue' in validatedData ? validatedData.companyRevenue.toString() : null,
        estimatedRate: validatedData.estimatedRate.toString(),
        estimatedMonthlyPayment: validatedData.estimatedMonthlyPayment.toString(),
        status: "pending",
      });

      res.status(201).json(application);
    } catch (error: any) {
      if (error.errors) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(400).json({ error: error.message });
    }
  });

  // Get loan application by id
  app.get("/api/loan-applications/:id", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const application = await storage.getLoanApplication(req.params.id);
      
      if (!application) {
        return res.status(404).json({ error: "Demande non trouvée" });
      }

      if (application.userId !== user.id) {
        return res.status(403).json({ error: "Accès refusé" });
      }

      res.json(application);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
