import { sql } from "drizzle-orm";
import { pgTable, text, varchar, decimal, timestamp, boolean, integer, pgEnum, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

export const applicationTypeEnum = pgEnum("application_type", ["particular", "professional"]);
export const applicationStatusEnum = pgEnum("application_status", ["pending", "under_review", "approved", "rejected", "withdrawn"]);
export const documentTypeEnum = pgEnum("document_type", ["identity", "proof_of_address", "income_proof", "company_registration", "tax_return", "bank_statement", "signed_contract", "other"]);
export const documentStatusEnum = pgEnum("document_status", ["pending", "approved", "rejected"]);
export const notificationTypeEnum = pgEnum("notification_type", ["info", "success", "warning", "error", "request"]);
export const contractStatusEnum = pgEnum("contract_status", ["generated", "sent", "signed", "verified", "rejected"]);
export const cardOrderStatusEnum = pgEnum("card_order_status", ["pending", "processing", "shipped", "delivered", "cancelled"]);

export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  fullName: text("full_name").notNull(),
  email: text("email").notNull().unique(),
  password: text("password").notNull(),
  phone: text("phone"),
  accountType: text("account_type").notNull().default("pro"),
  isAdmin: boolean("is_admin").notNull().default(false),
  profilePicture: text("profile_picture"),
  twoFactorEnabled: boolean("two_factor_enabled").notNull().default(false),
  twoFactorSecret: text("two_factor_secret"),
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
  contractId: varchar("contract_id"),
  transferProgress: integer("transfer_progress").notNull().default(0),
  reviewedBy: varchar("reviewed_by"),
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

export const documents = pgTable("documents", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  loanApplicationId: varchar("loan_application_id").references(() => loanApplications.id, { onDelete: "cascade" }),
  type: documentTypeEnum("type").notNull(),
  fileName: text("file_name").notNull(),
  fileUrl: text("file_url").notNull(),
  status: documentStatusEnum("status").notNull().default("pending"),
  reviewedBy: varchar("reviewed_by"),
  reviewedAt: timestamp("reviewed_at"),
  rejectionReason: text("rejection_reason"),
  uploadedAt: timestamp("uploaded_at").defaultNow(),
});

export const insertDocumentSchema = createInsertSchema(documents).omit({
  id: true,
  uploadedAt: true,
});

export type InsertDocument = z.infer<typeof insertDocumentSchema>;
export type Document = typeof documents.$inferSelect;

export const notifications = pgTable("notifications", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  fromAdminId: varchar("from_admin_id"),
  type: notificationTypeEnum("type").notNull(),
  title: text("title").notNull(),
  message: text("message").notNull(),
  read: boolean("read").notNull().default(false),
  actionUrl: text("action_url"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertNotificationSchema = createInsertSchema(notifications).omit({
  id: true,
  createdAt: true,
});

export type InsertNotification = z.infer<typeof insertNotificationSchema>;
export type Notification = typeof notifications.$inferSelect;

export const contracts = pgTable("contracts", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  loanApplicationId: varchar("loan_application_id").notNull().references(() => loanApplications.id, { onDelete: "cascade" }),
  contractNumber: text("contract_number").notNull().unique(),
  fileUrl: text("file_url").notNull(),
  status: contractStatusEnum("status").notNull().default("generated"),
  signedFileUrl: text("signed_file_url"),
  signedAt: timestamp("signed_at"),
  verifiedBy: varchar("verified_by"),
  verifiedAt: timestamp("verified_at"),
  rejectionReason: text("rejection_reason"),
  generatedBy: varchar("generated_by").notNull(),
  generatedAt: timestamp("generated_at").defaultNow(),
});

export const insertContractSchema = createInsertSchema(contracts).omit({
  id: true,
  generatedAt: true,
});

export type InsertContract = z.infer<typeof insertContractSchema>;
export type Contract = typeof contracts.$inferSelect;

export const transferCodes = pgTable("transfer_codes", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  loanApplicationId: varchar("loan_application_id").notNull().references(() => loanApplications.id, { onDelete: "cascade" }),
  code: text("code").notNull(),
  position: integer("position").notNull(),
  percentage: integer("percentage").notNull(),
  description: text("description").notNull(),
  used: boolean("used").notNull().default(false),
  usedAt: timestamp("used_at"),
  createdAt: timestamp("created_at").defaultNow(),
});

export const insertTransferCodeSchema = createInsertSchema(transferCodes).omit({
  id: true,
  createdAt: true,
});

export type InsertTransferCode = z.infer<typeof insertTransferCodeSchema>;
export type TransferCode = typeof transferCodes.$inferSelect;

export const cardOrders = pgTable("card_orders", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").notNull().references(() => users.id, { onDelete: "cascade" }),
  loanApplicationId: varchar("loan_application_id").references(() => loanApplications.id, { onDelete: "set null" }),
  cardType: text("card_type").notNull(),
  deliveryAddress: text("delivery_address").notNull(),
  status: cardOrderStatusEnum("status").notNull().default("pending"),
  trackingNumber: text("tracking_number"),
  orderedAt: timestamp("ordered_at").defaultNow(),
  shippedAt: timestamp("shipped_at"),
  deliveredAt: timestamp("delivered_at"),
});

export const insertCardOrderSchema = createInsertSchema(cardOrders).omit({
  id: true,
  orderedAt: true,
});

export type InsertCardOrder = z.infer<typeof insertCardOrderSchema>;
export type CardOrder = typeof cardOrders.$inferSelect;

// Validation schemas for API requests
export const uploadDocumentSchema = z.object({
  type: z.enum(["identity", "proof_of_address", "income_proof", "company_registration", "tax_return", "bank_statement", "signed_contract", "other"]),
  fileName: z.string().min(1, "Nom du fichier requis"),
  fileUrl: z.string().url("URL invalide"),
});

export const signContractSchema = z.object({
  signedFileUrl: z.string().url("URL du contrat signé invalide"),
});

export const validateCodeSchema = z.object({
  code: z.string().min(1, "Code requis"),
});

export const createCardOrderSchema = z.object({
  loanApplicationId: z.string().uuid("ID de demande invalide"),
  cardType: z.string().min(1, "Type de carte requis"),
  deliveryAddress: z.string().min(10, "Adresse de livraison requise"),
});

export const reviewDocumentSchema = z.object({
  status: z.enum(["approved", "rejected"]),
  rejectionReason: z.string().optional(),
});

export const approveRejectLoanSchema = z.object({
  message: z.string().optional(),
});

export const requestInfoSchema = z.object({
  message: z.string().min(1, "Message requis"),
});

export const verifyContractSchema = z.object({
  status: z.enum(["verified", "rejected"]),
  rejectionReason: z.string().optional(),
});

export const updateCardOrderStatusSchema = z.object({
  status: z.enum(["pending", "processing", "shipped", "delivered", "cancelled"]),
  trackingNumber: z.string().optional(),
});
