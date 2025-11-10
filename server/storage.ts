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
  type PasswordResetToken,
  type InsertPasswordResetToken,
  type Document,
  type InsertDocument,
  type Notification,
  type InsertNotification,
  type Contract,
  type InsertContract,
  type TransferCode,
  type InsertTransferCode,
  type CardOrder,
  type InsertCardOrder,
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
  getUserByVerificationToken(token: string): Promise<User | undefined>;
  getAllAdmins(): Promise<User[]>;
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
  getAllPendingLoanApplications(): Promise<LoanApplication[]>;
  createLoanApplication(application: InsertLoanApplication): Promise<LoanApplication>;
  updateLoanApplicationStatus(id: string, status: string, message?: string, reviewedBy?: string): Promise<LoanApplication | undefined>;
  updateLoanApplicationContract(id: string, contractId: string): Promise<LoanApplication | undefined>;
  updateLoanApplicationProgress(id: string, transferProgress: number): Promise<LoanApplication | undefined>;
  updateLoanApplication(id: string, updates: Partial<InsertLoanApplication>): Promise<LoanApplication | undefined>;

  // Password reset methods
  createPasswordResetToken(token: InsertPasswordResetToken): Promise<PasswordResetToken>;
  getAllPasswordResetTokens(): Promise<PasswordResetToken[]>;
  deletePasswordResetTokenById(id: string): Promise<void>;
  deleteExpiredPasswordResetTokens(): Promise<void>;

  // Document methods
  getDocument(id: string): Promise<Document | undefined>;
  getDocumentsByUserId(userId: string): Promise<Document[]>;
  getDocumentsByLoanApplicationId(loanApplicationId: string): Promise<Document[]>;
  createDocument(document: InsertDocument): Promise<Document>;
  updateDocumentStatus(id: string, status: string, reviewedBy?: string, rejectionReason?: string): Promise<Document | undefined>;

  // Notification methods
  getNotification(id: string): Promise<Notification | undefined>;
  getNotificationsByUserId(userId: string): Promise<Notification[]>;
  getUnreadNotificationsByUserId(userId: string): Promise<Notification[]>;
  createNotification(notification: InsertNotification): Promise<Notification>;
  markNotificationAsRead(id: string): Promise<Notification | undefined>;
  markAllNotificationsAsRead(userId: string): Promise<void>;

  // Contract methods
  getContract(id: string): Promise<Contract | undefined>;
  getContractByLoanApplicationId(loanApplicationId: string): Promise<Contract | undefined>;
  createContract(contract: InsertContract): Promise<Contract>;
  updateContractStatus(id: string, status: string, updates?: Partial<InsertContract>): Promise<Contract | undefined>;

  // Transfer code methods
  getTransferCode(id: string): Promise<TransferCode | undefined>;
  getTransferCodesByLoanApplicationId(loanApplicationId: string): Promise<TransferCode[]>;
  getNextTransferCode(loanApplicationId: string): Promise<TransferCode | undefined>;
  createTransferCode(code: InsertTransferCode): Promise<TransferCode>;
  validateAndUseTransferCode(loanApplicationId: string, code: string): Promise<TransferCode | undefined>;

  // Card order methods
  getCardOrder(id: string): Promise<CardOrder | undefined>;
  getCardOrdersByUserId(userId: string): Promise<CardOrder[]>;
  createCardOrder(cardOrder: InsertCardOrder): Promise<CardOrder>;
  updateCardOrderStatus(id: string, status: string, updates?: Partial<InsertCardOrder>): Promise<CardOrder | undefined>;
}

import { db } from "./db";
import { users, accounts, cards, transactions, loans, loanTypes, loanApplications, passwordResetTokens, documents, notifications, contracts, transferCodes, cardOrders } from "@shared/schema";
import { eq, desc, and, lt } from "drizzle-orm";

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

  async getUserByVerificationToken(token: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.verificationToken, token));
    return user;
  }

  async getAllAdmins(): Promise<User[]> {
    return db.select().from(users).where(eq(users.isAdmin, true));
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

  async getAllPendingLoanApplications(): Promise<LoanApplication[]> {
    return db.select()
      .from(loanApplications)
      .where(eq(loanApplications.status, "pending"))
      .orderBy(desc(loanApplications.submittedAt));
  }

  async createLoanApplication(insertApplication: InsertLoanApplication): Promise<LoanApplication> {
    const [application] = await db.insert(loanApplications).values(insertApplication).returning();
    return application;
  }

  async updateLoanApplicationStatus(id: string, status: string, message?: string, reviewedBy?: string): Promise<LoanApplication | undefined> {
    const updates: any = { 
      status,
      reviewedAt: new Date()
    };
    if (message) {
      updates.statusMessage = message;
    }
    if (reviewedBy) {
      updates.reviewedBy = reviewedBy;
    }
    const [application] = await db.update(loanApplications).set(updates).where(eq(loanApplications.id, id)).returning();
    return application;
  }

  async updateLoanApplicationContract(id: string, contractId: string): Promise<LoanApplication | undefined> {
    const [application] = await db.update(loanApplications).set({ contractId }).where(eq(loanApplications.id, id)).returning();
    return application;
  }

  async updateLoanApplicationProgress(id: string, transferProgress: number): Promise<LoanApplication | undefined> {
    const [application] = await db.update(loanApplications).set({ transferProgress }).where(eq(loanApplications.id, id)).returning();
    return application;
  }

  async updateLoanApplication(id: string, updates: Partial<InsertLoanApplication>): Promise<LoanApplication | undefined> {
    const [application] = await db.update(loanApplications).set(updates).where(eq(loanApplications.id, id)).returning();
    return application;
  }

  // Password reset methods
  async createPasswordResetToken(insertToken: InsertPasswordResetToken): Promise<PasswordResetToken> {
    const [token] = await db.insert(passwordResetTokens).values(insertToken).returning();
    return token;
  }

  async getAllPasswordResetTokens(): Promise<PasswordResetToken[]> {
    return db.select().from(passwordResetTokens);
  }

  async deletePasswordResetTokenById(id: string): Promise<void> {
    await db.delete(passwordResetTokens).where(eq(passwordResetTokens.id, id));
  }

  async deleteExpiredPasswordResetTokens(): Promise<void> {
    await db.delete(passwordResetTokens).where(lt(passwordResetTokens.expiresAt, new Date()));
  }

  // Document methods
  async getDocument(id: string): Promise<Document | undefined> {
    const [document] = await db.select().from(documents).where(eq(documents.id, id));
    return document;
  }

  async getDocumentsByUserId(userId: string): Promise<Document[]> {
    return db.select().from(documents).where(eq(documents.userId, userId)).orderBy(desc(documents.uploadedAt));
  }

  async getDocumentsByLoanApplicationId(loanApplicationId: string): Promise<Document[]> {
    return db.select().from(documents).where(eq(documents.loanApplicationId, loanApplicationId)).orderBy(desc(documents.uploadedAt));
  }

  async createDocument(insertDocument: InsertDocument): Promise<Document> {
    const [document] = await db.insert(documents).values(insertDocument).returning();
    return document;
  }

  async updateDocumentStatus(id: string, status: string, reviewedBy?: string, rejectionReason?: string): Promise<Document | undefined> {
    const updates: any = { 
      status,
      reviewedAt: new Date()
    };
    if (reviewedBy) {
      updates.reviewedBy = reviewedBy;
    }
    if (rejectionReason) {
      updates.rejectionReason = rejectionReason;
    }
    const [document] = await db.update(documents).set(updates).where(eq(documents.id, id)).returning();
    return document;
  }

  // Notification methods
  async getNotification(id: string): Promise<Notification | undefined> {
    const [notification] = await db.select().from(notifications).where(eq(notifications.id, id));
    return notification;
  }

  async getNotificationsByUserId(userId: string): Promise<Notification[]> {
    return db.select().from(notifications).where(eq(notifications.userId, userId)).orderBy(desc(notifications.createdAt));
  }

  async getUnreadNotificationsByUserId(userId: string): Promise<Notification[]> {
    return db.select().from(notifications).where(
      and(
        eq(notifications.userId, userId),
        eq(notifications.read, false)
      )
    ).orderBy(desc(notifications.createdAt));
  }

  async createNotification(insertNotification: InsertNotification): Promise<Notification> {
    const [notification] = await db.insert(notifications).values(insertNotification).returning();
    return notification;
  }

  async markNotificationAsRead(id: string): Promise<Notification | undefined> {
    const [notification] = await db.update(notifications).set({ read: true }).where(eq(notifications.id, id)).returning();
    return notification;
  }

  async markAllNotificationsAsRead(userId: string): Promise<void> {
    await db.update(notifications).set({ read: true }).where(eq(notifications.userId, userId));
  }

  // Contract methods
  async getContract(id: string): Promise<Contract | undefined> {
    const [contract] = await db.select().from(contracts).where(eq(contracts.id, id));
    return contract;
  }

  async getContractByLoanApplicationId(loanApplicationId: string): Promise<Contract | undefined> {
    const [contract] = await db.select().from(contracts).where(eq(contracts.loanApplicationId, loanApplicationId));
    return contract;
  }

  async createContract(insertContract: InsertContract): Promise<Contract> {
    const [contract] = await db.insert(contracts).values(insertContract).returning();
    return contract;
  }

  async updateContractStatus(id: string, status: string, updates?: Partial<InsertContract>): Promise<Contract | undefined> {
    const updateData: any = { status };
    if (updates) {
      Object.assign(updateData, updates);
    }
    const [contract] = await db.update(contracts).set(updateData).where(eq(contracts.id, id)).returning();
    return contract;
  }

  // Transfer code methods
  async getTransferCode(id: string): Promise<TransferCode | undefined> {
    const [code] = await db.select().from(transferCodes).where(eq(transferCodes.id, id));
    return code;
  }

  async getTransferCodesByLoanApplicationId(loanApplicationId: string): Promise<TransferCode[]> {
    return db.select().from(transferCodes).where(eq(transferCodes.loanApplicationId, loanApplicationId)).orderBy(transferCodes.position);
  }

  async getNextTransferCode(loanApplicationId: string): Promise<TransferCode | undefined> {
    const [code] = await db.select().from(transferCodes).where(
      and(
        eq(transferCodes.loanApplicationId, loanApplicationId),
        eq(transferCodes.used, false)
      )
    ).orderBy(transferCodes.position).limit(1);
    return code;
  }

  async createTransferCode(insertCode: InsertTransferCode): Promise<TransferCode> {
    const [code] = await db.insert(transferCodes).values(insertCode).returning();
    return code;
  }

  async validateAndUseTransferCode(loanApplicationId: string, code: string): Promise<TransferCode | undefined> {
    const [transferCode] = await db.select().from(transferCodes).where(
      and(
        eq(transferCodes.loanApplicationId, loanApplicationId),
        eq(transferCodes.code, code),
        eq(transferCodes.used, false)
      )
    );
    
    if (!transferCode) {
      return undefined;
    }

    const [usedCode] = await db.update(transferCodes).set({
      used: true,
      usedAt: new Date()
    }).where(eq(transferCodes.id, transferCode.id)).returning();

    return usedCode;
  }

  // Card order methods
  async getCardOrder(id: string): Promise<CardOrder | undefined> {
    const [cardOrder] = await db.select().from(cardOrders).where(eq(cardOrders.id, id));
    return cardOrder;
  }

  async getCardOrdersByUserId(userId: string): Promise<CardOrder[]> {
    return db.select().from(cardOrders).where(eq(cardOrders.userId, userId)).orderBy(desc(cardOrders.orderedAt));
  }

  async createCardOrder(insertCardOrder: InsertCardOrder): Promise<CardOrder> {
    const [cardOrder] = await db.insert(cardOrders).values(insertCardOrder).returning();
    return cardOrder;
  }

  async updateCardOrderStatus(id: string, status: string, updates?: Partial<InsertCardOrder>): Promise<CardOrder | undefined> {
    const updateData: any = { status };
    if (updates) {
      Object.assign(updateData, updates);
    }
    const [cardOrder] = await db.update(cardOrders).set(updateData).where(eq(cardOrders.id, id)).returning();
    return cardOrder;
  }
}

export const storage = new DbStorage();
