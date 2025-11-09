import { 
  type User, 
  type InsertUser,
  type Account,
  type InsertAccount,
  type Card,
  type InsertCard,
  type Transaction,
  type InsertTransaction,
  type Loan,
  type InsertLoan,
  type LoanType,
  type InsertLoanType,
  type LoanApplication,
  type InsertLoanApplication,
} from "@shared/schema";
import { randomUUID } from "crypto";

export interface MonthlyStats {
  month: string;
  revenus: number;
  dépenses: number;
}

export interface IStorage {
  // User methods
  getUser(id: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;
  updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined>;

  // Account methods
  getAccount(id: string): Promise<Account | undefined>;
  getAccountsByUserId(userId: string): Promise<Account[]>;
  createAccount(account: InsertAccount): Promise<Account>;
  updateAccountBalance(id: string, balance: string): Promise<Account | undefined>;

  // Card methods
  getCard(id: string): Promise<Card | undefined>;
  getCardsByUserId(userId: string): Promise<Card[]>;
  createCard(card: InsertCard): Promise<Card>;
  updateCard(id: string, updates: Partial<InsertCard>): Promise<Card | undefined>;

  // Transaction methods
  getTransaction(id: string): Promise<Transaction | undefined>;
  getTransactionsByAccountId(accountId: string): Promise<Transaction[]>;
  createTransaction(transaction: InsertTransaction): Promise<Transaction>;

  // Loan methods
  getLoan(id: string): Promise<Loan | undefined>;
  getLoansByUserId(userId: string): Promise<Loan[]>;
  createLoan(loan: InsertLoan): Promise<Loan>;
  updateLoan(id: string, updates: Partial<InsertLoan>): Promise<Loan | undefined>;

  // Stats methods
  getMonthlyStats(accountIds: string[]): Promise<MonthlyStats[]>;

  // LoanType methods
  getLoanType(id: string): Promise<LoanType | undefined>;
  getAllActiveLoanTypes(): Promise<LoanType[]>;
  getLoanTypesByCategory(category: string): Promise<LoanType[]>;
  createLoanType(loanType: InsertLoanType): Promise<LoanType>;
  
  // LoanApplication methods
  getLoanApplication(id: string): Promise<LoanApplication | undefined>;
  getLoanApplicationsByUserId(userId: string): Promise<LoanApplication[]>;
  createLoanApplication(application: InsertLoanApplication): Promise<LoanApplication>;
  updateLoanApplicationStatus(id: string, status: string, message?: string): Promise<LoanApplication | undefined>;
}

import { db } from "./db";
import { users, accounts, cards, transactions, loans, loanTypes, loanApplications } from "@shared/schema";
import { eq, desc, and } from "drizzle-orm";

export class DbStorage implements IStorage {
  // User methods
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const [user] = await db.insert(users).values(insertUser).returning();
    return user;
  }

  async updateUser(id: string, updates: Partial<InsertUser>): Promise<User | undefined> {
    const [user] = await db.update(users).set(updates).where(eq(users.id, id)).returning();
    return user;
  }

  // Account methods
  async getAccount(id: string): Promise<Account | undefined> {
    const [account] = await db.select().from(accounts).where(eq(accounts.id, id));
    return account;
  }

  async getAccountsByUserId(userId: string): Promise<Account[]> {
    return db.select().from(accounts).where(eq(accounts.userId, userId));
  }

  async createAccount(insertAccount: InsertAccount): Promise<Account> {
    const [account] = await db.insert(accounts).values(insertAccount).returning();
    return account;
  }

  async updateAccountBalance(id: string, balance: string): Promise<Account | undefined> {
    const [account] = await db.update(accounts).set({ balance }).where(eq(accounts.id, id)).returning();
    return account;
  }

  // Card methods
  async getCard(id: string): Promise<Card | undefined> {
    const [card] = await db.select().from(cards).where(eq(cards.id, id));
    return card;
  }

  async getCardsByUserId(userId: string): Promise<Card[]> {
    return db.select().from(cards).where(eq(cards.userId, userId));
  }

  async createCard(insertCard: InsertCard): Promise<Card> {
    const [card] = await db.insert(cards).values(insertCard).returning();
    return card;
  }

  async updateCard(id: string, updates: Partial<InsertCard>): Promise<Card | undefined> {
    const [card] = await db.update(cards).set(updates).where(eq(cards.id, id)).returning();
    return card;
  }

  // Transaction methods
  async getTransaction(id: string): Promise<Transaction | undefined> {
    const [transaction] = await db.select().from(transactions).where(eq(transactions.id, id));
    return transaction;
  }

  async getTransactionsByAccountId(accountId: string): Promise<Transaction[]> {
    return db.select()
      .from(transactions)
      .where(eq(transactions.accountId, accountId))
      .orderBy(desc(transactions.date));
  }

  async createTransaction(insertTransaction: InsertTransaction): Promise<Transaction> {
    const [transaction] = await db.insert(transactions).values(insertTransaction).returning();
    return transaction;
  }

  // Loan methods
  async getLoan(id: string): Promise<Loan | undefined> {
    const [loan] = await db.select().from(loans).where(eq(loans.id, id));
    return loan;
  }

  async getLoansByUserId(userId: string): Promise<Loan[]> {
    return db.select().from(loans).where(eq(loans.userId, userId));
  }

  async createLoan(insertLoan: InsertLoan): Promise<Loan> {
    const [loan] = await db.insert(loans).values(insertLoan).returning();
    return loan;
  }

  async updateLoan(id: string, updates: Partial<InsertLoan>): Promise<Loan | undefined> {
    const [loan] = await db.update(loans).set(updates).where(eq(loans.id, id)).returning();
    return loan;
  }

  async getMonthlyStats(accountIds: string[]): Promise<MonthlyStats[]> {
    if (accountIds.length === 0) {
      return [];
    }

    const allTransactions = await db.select()
      .from(transactions)
      .where(eq(transactions.accountId, accountIds[0]));

    const monthlyMap = new Map<string, { revenus: number; dépenses: number }>();
    const monthNames = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];

    allTransactions.forEach(txn => {
      const date = new Date(txn.date);
      const monthKey = `${monthNames[date.getMonth()]}`;
      const amount = parseFloat(txn.amount);

      if (!monthlyMap.has(monthKey)) {
        monthlyMap.set(monthKey, { revenus: 0, dépenses: 0 });
      }

      const stats = monthlyMap.get(monthKey)!;
      if (amount > 0) {
        stats.revenus += amount;
      } else {
        stats.dépenses += Math.abs(amount);
      }
    });

    const last6Months = monthNames.slice(0, 6);
    return last6Months.map(month => ({
      month,
      revenus: monthlyMap.get(month)?.revenus || 0,
      dépenses: monthlyMap.get(month)?.dépenses || 0,
    }));
  }

  // LoanType methods
  async getLoanType(id: string): Promise<LoanType | undefined> {
    const [loanType] = await db.select().from(loanTypes).where(eq(loanTypes.id, id));
    return loanType;
  }

  async getAllActiveLoanTypes(): Promise<LoanType[]> {
    return db.select().from(loanTypes).where(eq(loanTypes.active, true));
  }

  async getLoanTypesByCategory(category: string): Promise<LoanType[]> {
    return db.select().from(loanTypes).where(
      and(
        eq(loanTypes.category, category),
        eq(loanTypes.active, true)
      )
    );
  }

  async createLoanType(insertLoanType: InsertLoanType): Promise<LoanType> {
    const [loanType] = await db.insert(loanTypes).values(insertLoanType).returning();
    return loanType;
  }

  // LoanApplication methods
  async getLoanApplication(id: string): Promise<LoanApplication | undefined> {
    const [application] = await db.select().from(loanApplications).where(eq(loanApplications.id, id));
    return application;
  }

  async getLoanApplicationsByUserId(userId: string): Promise<LoanApplication[]> {
    return db.select()
      .from(loanApplications)
      .where(eq(loanApplications.userId, userId))
      .orderBy(desc(loanApplications.submittedAt));
  }

  async createLoanApplication(insertApplication: InsertLoanApplication): Promise<LoanApplication> {
    const [application] = await db.insert(loanApplications).values(insertApplication).returning();
    return application;
  }

  async updateLoanApplicationStatus(id: string, status: string, message?: string): Promise<LoanApplication | undefined> {
    const updates: any = { 
      status,
      reviewedAt: new Date()
    };
    if (message) {
      updates.statusMessage = message;
    }
    const [application] = await db.update(loanApplications).set(updates).where(eq(loanApplications.id, id)).returning();
    return application;
  }
}

export const storage = new DbStorage();
