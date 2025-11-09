import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, boolean, integer, pgEnum, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const applicationTypeEnum = pgEnum("application_type", ["particular", "professional"]);
export const applicationStatusEnum = pgEnum("application_status", ["pending", "under_review", "approved", "rejected", "withdrawn"]);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  phone: text("phone"),
  accountType: text("account_type").notNull().default("pro"),
  emailVerified: boolean("email_verified").notNull().default(false),
  verificationToken: text("verification_token"),
  verificationTokenExpiry: timestamp("verification_token_expiry"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
});

export const registerUserSchema = z.object({
  fullName: z.string().min(2, "Le nom doit contenir au moins 2 caractères"),
  email: z.string().email("Email invalide"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
  phone: z.string().optional(),
  accountType: z.string().default("pro"),
});

export const loginUserSchema = z.object({
  email: z.string().email("Email invalide"),
  password: z.string().min(1, "Mot de passe requis"),
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
export type UserWithoutPassword = Omit<User, "password">;

export const accounts = pgTable("accounts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  name: text("name").notNull(),
  accountNumber: text("account_number").notNull().unique(),
  type: text("type").notNull(),
  balance: decimal("balance", { precision: 15, scale: 2 }).notNull().default("0"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertAccountSchema = createInsertSchema(accounts).omit({
  id: true,
  createdAt: true,
});

export type InsertAccount = z.infer<typeof insertAccountSchema>;
export type Account = typeof accounts.$inferSelect;

export const cards = pgTable("cards", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  accountId: varchar("account_id").notNull(),
  name: text("name").notNull(),
  cardNumber: text("card_number").notNull(),
  cardType: text("card_type").notNull(),
  status: text("status").notNull().default("active"),
  expiryDate: text("expiry_date").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertCardSchema = createInsertSchema(cards).omit({
  id: true,
  createdAt: true,
});

export type InsertCard = z.infer<typeof insertCardSchema>;
export type Card = typeof cards.$inferSelect;

export const transactions = pgTable("transactions", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  accountId: varchar("account_id").notNull(),
  description: text("description").notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  type: text("type").notNull(),
  category: text("category").notNull(),
  status: text("status").notNull().default("completed"),
  date: timestamp("date").notNull().defaultNow(),
});

export const insertTransactionSchema = createInsertSchema(transactions).omit({
  id: true,
});

export type InsertTransaction = z.infer<typeof insertTransactionSchema>;
export type Transaction = typeof transactions.$inferSelect;

export const loans = pgTable("loans", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull(),
  name: text("name").notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  borrowed: decimal("borrowed", { precision: 15, scale: 2 }).notNull(),
  monthlyPayment: decimal("monthly_payment", { precision: 15, scale: 2 }).notNull(),
  interestRate: decimal("interest_rate", { precision: 5, scale: 2 }).notNull(),
  endDate: text("end_date").notNull(),
  status: text("status").notNull().default("active"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertLoanSchema = createInsertSchema(loans).omit({
  id: true,
  createdAt: true,
});

export type InsertLoan = z.infer<typeof insertLoanSchema>;
export type Loan = typeof loans.$inferSelect;

export const loanTypes = pgTable("loan_types", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  slug: text("slug").notNull().unique(),
  nameKey: text("name_key").notNull(),
  descriptionKey: text("description_key").notNull(),
  category: text("category").notNull(),
  minAmount: decimal("min_amount", { precision: 15, scale: 2 }).notNull(),
  maxAmount: decimal("max_amount", { precision: 15, scale: 2 }).notNull(),
  minDurationMonths: integer("min_duration_months").notNull(),
  maxDurationMonths: integer("max_duration_months").notNull(),
  minRate: decimal("min_rate", { precision: 5, scale: 2 }).notNull(),
  maxRate: decimal("max_rate", { precision: 5, scale: 2 }).notNull(),
  featureKeys: jsonb("feature_keys").$type<string[]>().notNull().default([]),
  active: boolean("active").notNull().default(true),
});

export const insertLoanTypeSchema = createInsertSchema(loanTypes).omit({
  id: true,
});

export type InsertLoanType = z.infer<typeof insertLoanTypeSchema>;
export type LoanType = typeof loanTypes.$inferSelect;

export const loanApplications = pgTable("loan_applications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  loanTypeId: varchar("loan_type_id").notNull().references(() => loanTypes.id, { onDelete: "restrict" }),
  applicationType: applicationTypeEnum("application_type").notNull(),
  amount: decimal("amount", { precision: 15, scale: 2 }).notNull(),
  durationMonths: integer("duration_months").notNull(),
  monthlyIncome: decimal("monthly_income", { precision: 15, scale: 2 }),
  employmentStatus: text("employment_status"),
  purpose: text("purpose"),
  companyName: text("company_name"),
  siret: text("siret"),
  companyRevenue: decimal("company_revenue", { precision: 15, scale: 2 }),
  estimatedRate: decimal("estimated_rate", { precision: 5, scale: 2 }).notNull(),
  estimatedMonthlyPayment: decimal("estimated_monthly_payment", { precision: 15, scale: 2 }).notNull(),
  status: applicationStatusEnum("status").notNull().default("pending"),
  statusMessage: text("status_message"),
  submittedAt: timestamp("submitted_at").defaultNow(),
  reviewedAt: timestamp("reviewed_at"),
});

export const insertLoanApplicationSchema = createInsertSchema(loanApplications).omit({
  id: true,
  submittedAt: true,
});

const baseApplicationSchema = z.object({
  loanTypeId: z.string().uuid("ID du type de prêt invalide"),
  amount: z.number().positive("Le montant doit être positif"),
  durationMonths: z.number().int().positive("La durée doit être un nombre entier de mois positif"),
  estimatedRate: z.number().positive("Le taux doit être positif"),
  estimatedMonthlyPayment: z.number().positive("La mensualité doit être positive"),
});

export const createParticularLoanApplicationSchema = baseApplicationSchema.extend({
  applicationType: z.literal("particular"),
  monthlyIncome: z.number().positive("Le revenu mensuel doit être positif"),
  employmentStatus: z.string().min(1, "Le statut d'emploi est requis"),
  purpose: z.string().min(10, "Veuillez décrire votre projet (minimum 10 caractères)"),
});

export const createProfessionalLoanApplicationSchema = baseApplicationSchema.extend({
  applicationType: z.literal("professional"),
  companyName: z.string().min(2, "Le nom de l'entreprise est requis"),
  siret: z.string().regex(/^\d{14}$/, "Le SIRET doit contenir 14 chiffres"),
  companyRevenue: z.number().positive("Le chiffre d'affaires doit être positif"),
  purpose: z.string().min(10, "Veuillez décrire votre projet (minimum 10 caractères)"),
});

export const createLoanApplicationSchema = z.discriminatedUnion("applicationType", [
  createParticularLoanApplicationSchema,
  createProfessionalLoanApplicationSchema,
]);

export type InsertLoanApplication = z.infer<typeof insertLoanApplicationSchema>;
export type LoanApplication = typeof loanApplications.$inferSelect;
export type CreateLoanApplication = z.infer<typeof createLoanApplicationSchema>;

export const passwordResetTokens = pgTable("password_reset_tokens", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  token: text("token").notNull().unique(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertPasswordResetTokenSchema = createInsertSchema(passwordResetTokens).omit({
  id: true,
  createdAt: true,
});

export type InsertPasswordResetToken = z.infer<typeof insertPasswordResetTokenSchema>;
export type PasswordResetToken = typeof passwordResetTokens.$inferSelect;

export const forgotPasswordSchema = z.object({
  email: z.string().email("Email invalide"),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Token requis"),
  password: z.string().min(8, "Le mot de passe doit contenir au moins 8 caractères"),
});
