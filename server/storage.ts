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
} from "@shared/schema";
import { randomUUID } from "crypto";

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
}

import { db } from "./db";
import { users, accounts, cards, transactions, loans } from "@shared/schema";
import { eq, desc } from "drizzle-orm";

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
}

export const storage = new DbStorage();
