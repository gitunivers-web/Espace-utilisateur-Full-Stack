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
  forgotPasswordSchema,
  resetPasswordSchema,
  uploadDocumentSchema,
  signContractSchema,
  validateCodeSchema,
  createCardOrderSchema,
  reviewDocumentSchema,
  approveRejectLoanSchema,
  requestInfoSchema,
  verifyContractSchema,
  updateCardOrderStatusSchema,
  type User,
  type UserWithoutPassword,
} from "@shared/schema";
import { z } from "zod";
import passport from "./auth";
import { sendPasswordResetEmail, sendVerificationEmail } from "./email";
import { randomBytes } from "crypto";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";
import { PDFGenerator } from "./services/pdfGenerator";
import { translateLoanType } from "./services/loanTypeTranslations";
import speakeasy from "speakeasy";
import QRCode from "qrcode";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const profilePictureStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads/profile-pictures"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, "profile-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadProfilePicture = multer({
  storage: profilePictureStorage,
  limits: {
    fileSize: 5 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Seules les images (JPEG, PNG, WEBP) sont autorisées"));
    }
  }
});

const documentStorage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../public/uploads/documents"));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
    cb(null, "doc-" + uniqueSuffix + path.extname(file.originalname));
  }
});

const uploadDocument = multer({
  storage: documentStorage,
  limits: {
    fileSize: 10 * 1024 * 1024
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|webp|pdf/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype) || file.mimetype === 'application/pdf';
    
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb(new Error("Seuls les fichiers PDF et images sont autorisés"));
    }
  }
});

function requireAuth(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ error: "Non authentifié" });
}

function requireAdmin(req: Request, res: Response, next: NextFunction) {
  if (req.isAuthenticated() && (req.user as any).isAdmin) {
    return next();
  }
  res.status(403).json({ error: "Accès admin requis" });
}

function omitPassword(user: User): UserWithoutPassword {
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
}

async function seedUserData(userId: string) {
  const accountNumber = `FR76 ${Math.random().toString().substring(2, 6)} ${Math.random().toString().substring(2, 6)} ${Math.random().toString().substring(2, 8)} ${Math.random().toString().substring(2, 4)} ${Math.random().toString().substring(2, 4)}`;
  
  const account = await storage.createAccount({
    userId,
    name: "Compte Courant",
    accountNumber,
    type: "Courant",
    balance: "5000.00",
  });

  const cardNumber = `${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)} ${Math.floor(1000 + Math.random() * 9000)}`;
  const expiryMonth = String(Math.floor(Math.random() * 12) + 1).padStart(2, '0');
  const expiryYear = String(new Date().getFullYear() + 3 + Math.floor(Math.random() * 2)).substring(2);
  
  await storage.createCard({
    userId,
    accountId: account.id,
    name: "Carte Visa",
    cardNumber,
    cardType: "Visa",
    status: "active",
    expiryDate: `${expiryMonth}/${expiryYear}`,
  });

  const sampleTransactions = [
    { description: "Virement de bienvenue", amount: "5000.00", type: "credit", category: "Virement" },
    { description: "Abonnement Netflix", amount: "-15.99", type: "debit", category: "Loisirs" },
    { description: "Courses Carrefour", amount: "-67.42", type: "debit", category: "Alimentation" },
    { description: "Salaire", amount: "2800.00", type: "credit", category: "Salaire" },
    { description: "Loyer", amount: "-900.00", type: "debit", category: "Logement" },
  ];

  for (const txn of sampleTransactions) {
    await storage.createTransaction({
      accountId: account.id,
      description: txn.description,
      amount: txn.amount,
      type: txn.type,
      category: txn.category,
      status: "completed",
      date: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000),
    });
  }
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
      
      // En développement, créer le compte comme déjà vérifié
      const isDevelopment = process.env.NODE_ENV === 'development';
      
      const user = await storage.createUser({
        ...data,
        password: hashedPassword,
        emailVerified: isDevelopment ? true : false,
        verificationToken: isDevelopment ? null : randomBytes(32).toString('hex'),
        verificationTokenExpiry: isDevelopment ? null : new Date(Date.now() + 24 * 60 * 60 * 1000),
      });

      await seedUserData(user.id);

      if (!isDevelopment) {
        const baseUrl = process.env.REPLIT_DEV_DOMAIN 
          ? `https://${process.env.REPLIT_DEV_DOMAIN}` 
          : `http://localhost:${process.env.PORT || 5000}`;
        const verificationLink = `${baseUrl}/verify-email?token=${user.verificationToken}`;

        await sendVerificationEmail({
          to: user.email,
          verificationLink,
          userName: user.fullName,
        });

        res.status(201).json({ 
          message: "Inscription réussie ! Veuillez vérifier votre email pour activer votre compte." 
        });
      } else {
        // En développement, connecter automatiquement l'utilisateur
        req.login(user, (err) => {
          if (err) {
            return res.status(500).json({ error: "Erreur lors de la connexion" });
          }
          res.status(201).json({ 
            message: "Inscription réussie ! Vous êtes maintenant connecté.",
            user: omitPassword(user)
          });
        });
      }
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  app.get("/api/auth/verify-email", async (req, res) => {
    try {
      const { token } = req.query;
      
      if (!token || typeof token !== 'string') {
        return res.status(400).json({ error: "Token manquant" });
      }

      const user = await storage.getUserByVerificationToken(token);
      
      if (!user) {
        return res.status(400).json({ error: "Token invalide" });
      }

      if (!user.verificationTokenExpiry || new Date() > user.verificationTokenExpiry) {
        return res.status(400).json({ error: "Token expiré" });
      }

      await storage.updateUser(user.id, {
        emailVerified: true,
        verificationToken: null,
        verificationTokenExpiry: null,
      });

      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ error: "Erreur lors de la connexion" });
        }
        res.json({ 
          success: true, 
          message: "Email vérifié avec succès",
          user: omitPassword(user)
        });
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

      if (user.twoFactorEnabled) {
        (req.session as any).pending2FAUserId = user.id;
        return res.json({ 
          requires2FA: true,
          email: user.email
        });
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

  // Upload profile picture
  app.post("/api/user/profile-picture", requireAuth, uploadProfilePicture.single("profilePicture"), async (req, res) => {
    try {
      const user = req.user as User;
      
      if (!req.file) {
        return res.status(400).json({ error: "Aucun fichier téléchargé" });
      }

      const profilePictureUrl = `/api/user/profile-picture/${req.file.filename}`;
      
      const updatedUser = await storage.updateUser(user.id, { profilePicture: profilePictureUrl });
      if (!updatedUser) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }
      
      res.json({ 
        success: true, 
        profilePicture: profilePictureUrl,
        user: omitPassword(updatedUser)
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Upload document file
  app.post("/api/documents/upload", requireAuth, uploadDocument.single("document"), async (req, res) => {
    try {
      const user = req.user as User;
      
      if (!req.file) {
        return res.status(400).json({ error: "Aucun fichier téléchargé" });
      }

      const { type, loanApplicationId } = req.body;
      
      if (!type) {
        return res.status(400).json({ error: "Le type de document est requis" });
      }

      // Verify ownership of loan application if provided
      if (loanApplicationId) {
        const application = await storage.getLoanApplication(loanApplicationId);
        if (!application) {
          return res.status(404).json({ error: "Demande de prêt non trouvée" });
        }
        if (application.userId !== user.id && !(user as any).isAdmin) {
          return res.status(403).json({ error: "Vous ne pouvez pas ajouter de documents à cette demande" });
        }
      }

      const documentUrl = `/api/documents/file/${req.file.filename}`;
      
      const document = await storage.createDocument({
        userId: user.id,
        loanApplicationId: loanApplicationId || null,
        type,
        fileName: req.file.originalname,
        fileUrl: documentUrl,
        status: "pending",
      });
      
      res.json({ 
        success: true, 
        document
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Serve document files (protected)
  app.get("/api/documents/file/:filename", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const { filename } = req.params;
      
      // Find document by fileUrl
      const allDocs = await storage.getDocumentsByUserId(user.id);
      const document = allDocs.find(doc => doc.fileUrl.includes(filename));
      
      // Allow admins to access any document
      if (!document && !(user as any).isAdmin) {
        return res.status(404).json({ error: "Document non trouvé" });
      }

      const filePath = path.join(__dirname, "../public/uploads/documents", filename);
      res.sendFile(filePath);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Delete document (protected)
  app.delete("/api/documents/:id", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const { id } = z.object({ id: z.string() }).parse(req.params);

      const document = await storage.getDocument(id);
      if (!document) {
        return res.status(404).json({ error: "Document non trouvé" });
      }

      if (document.userId !== user.id && !(user as any).isAdmin) {
        return res.status(403).json({ error: "Accès refusé" });
      }

      if (document.status === "approved") {
        return res.status(409).json({ 
          error: "Impossible de supprimer un document approuvé",
          warning: "Veuillez contacter un administrateur si nécessaire"
        });
      }

      if (document.loanApplicationId) {
        const application = await storage.getLoanApplication(document.loanApplicationId);
        if (application && (application.status === "approved" || application.status === "under_review")) {
          return res.status(409).json({ 
            error: "Impossible de supprimer un document d'une demande en cours ou approuvée"
          });
        }
      }

      const filename = document.fileUrl.split('/').pop();
      if (filename) {
        const filePath = path.join(__dirname, "../public/uploads/documents", filename);
        try {
          fs.unlinkSync(filePath);
        } catch (err) {
          console.error(`Failed to delete file ${filePath}:`, err);
        }
      }

      await storage.deleteDocument(id);
      
      res.json({ success: true, message: "Document supprimé avec succès" });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Serve profile pictures (protected)
  app.get("/api/user/profile-picture/:filename", requireAuth, async (req, res) => {
    try {
      const { filename } = req.params;
      const filePath = path.join(__dirname, "../public/uploads/profile-pictures", filename);
      res.sendFile(filePath);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
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

  // 2FA Setup - Generate secret and QR code
  app.post("/api/2fa/setup", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      
      if (user.twoFactorEnabled) {
        return res.status(400).json({ error: "2FA est déjà activé" });
      }

      const secret = speakeasy.generateSecret({
        name: `Lendia (${user.email})`,
        issuer: "Lendia",
        length: 32,
      });

      const qrCodeDataUrl = await QRCode.toDataURL(secret.otpauth_url!);
      
      res.json({ 
        secret: secret.base32,
        qrCode: qrCodeDataUrl,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // 2FA Enable - Verify token and save secret
  app.post("/api/2fa/enable", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const { token, secret } = z.object({
        token: z.string().length(6, "Le code doit contenir 6 chiffres"),
        secret: z.string().min(1, "Secret requis"),
      }).parse(req.body);

      const verified = speakeasy.totp.verify({
        secret: secret,
        encoding: "base32",
        token: token,
        window: 2,
      });

      if (!verified) {
        return res.status(400).json({ error: "Code invalide" });
      }

      await storage.updateUser(user.id, {
        twoFactorEnabled: true,
        twoFactorSecret: secret,
      });

      res.json({ success: true, message: "2FA activé avec succès" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // 2FA Disable - Verify token and disable
  app.post("/api/2fa/disable", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      
      if (!user.twoFactorEnabled || !user.twoFactorSecret) {
        return res.status(400).json({ error: "2FA n'est pas activé" });
      }

      const { token } = z.object({
        token: z.string().length(6, "Le code doit contenir 6 chiffres"),
      }).parse(req.body);

      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: "base32",
        token: token,
        window: 2,
      });

      if (!verified) {
        return res.status(400).json({ error: "Code invalide" });
      }

      await storage.updateUser(user.id, {
        twoFactorEnabled: false,
        twoFactorSecret: null,
      });

      res.json({ success: true, message: "2FA désactivé avec succès" });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // 2FA Verify - Verify token during login
  app.post("/api/2fa/verify", async (req, res) => {
    try {
      const { email, token } = z.object({
        email: z.string().email(),
        token: z.string().length(6, "Le code doit contenir 6 chiffres"),
      }).parse(req.body);

      const pendingUserId = (req.session as any).pending2FAUserId;
      if (!pendingUserId) {
        return res.status(401).json({ error: "Aucune tentative de connexion en cours" });
      }

      const user = await storage.getUserByEmail(email);
      
      if (!user || user.id !== pendingUserId) {
        return res.status(403).json({ error: "Tentative de connexion non autorisée" });
      }

      if (!user.twoFactorEnabled || !user.twoFactorSecret) {
        return res.status(400).json({ error: "Configuration 2FA invalide" });
      }

      const verified = speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: "base32",
        token: token,
        window: 2,
      });

      if (!verified) {
        return res.status(400).json({ error: "Code invalide" });
      }

      delete (req.session as any).pending2FAUserId;

      req.login(user, (err) => {
        if (err) {
          return res.status(500).json({ error: "Erreur lors de la connexion" });
        }
        res.json({ 
          success: true,
          user: omitPassword(user)
        });
      });
    } catch (error: any) {
      res.status(400).json({ error: error.message });
    }
  });

  // Forgot password - send reset email
  app.post("/api/auth/forgot-password", async (req, res) => {
    try {
      const { email } = forgotPasswordSchema.parse(req.body);
      
      const user = await storage.getUserByEmail(email);
      if (!user) {
        return res.json({ 
          success: true, 
          message: "Si cet email existe, un lien de réinitialisation a été envoyé" 
        });
      }

      await storage.deleteExpiredPasswordResetTokens();
      
      const token = randomBytes(32).toString("hex");
      const hashedToken = await bcrypt.hash(token, 10);
      const expiresAt = new Date(Date.now() + 60 * 60 * 1000);
      
      await storage.createPasswordResetToken({
        userId: user.id,
        token: hashedToken,
        expiresAt,
      });

      const resetLink = `${process.env.REPLIT_DEV_DOMAIN ? `https://${process.env.REPLIT_DEV_DOMAIN}` : 'http://localhost:5000'}/reset-password?token=${token}`;
      
      await sendPasswordResetEmail({
        to: user.email,
        resetLink,
        userName: user.fullName,
      });

      res.json({ 
        success: true, 
        message: "Si cet email existe, un lien de réinitialisation a été envoyé" 
      });
    } catch (error: any) {
      console.error("Error in forgot-password:", error);
      res.status(500).json({ error: "Une erreur est survenue" });
    }
  });

  // Verify reset token
  app.get("/api/auth/verify-reset-token/:token", async (req, res) => {
    try {
      const { token } = req.params;
      
      await storage.deleteExpiredPasswordResetTokens();
      
      const allTokens = await storage.getAllPasswordResetTokens();
      let validToken = null;
      
      for (const dbToken of allTokens) {
        const isValid = await bcrypt.compare(token, dbToken.token);
        if (isValid && new Date() <= dbToken.expiresAt) {
          validToken = dbToken;
          break;
        }
      }
      
      if (!validToken) {
        return res.status(400).json({ error: "Token invalide ou expiré" });
      }

      res.json({ valid: true });
    } catch (error: any) {
      res.status(500).json({ error: "Une erreur est survenue" });
    }
  });

  // Reset password with token
  app.post("/api/auth/reset-password", async (req, res) => {
    try {
      const { token, password } = resetPasswordSchema.parse(req.body);
      
      await storage.deleteExpiredPasswordResetTokens();
      
      const allTokens = await storage.getAllPasswordResetTokens();
      let validToken = null;
      
      for (const dbToken of allTokens) {
        const isValid = await bcrypt.compare(token, dbToken.token);
        if (isValid && new Date() <= dbToken.expiresAt) {
          validToken = dbToken;
          break;
        }
      }
      
      if (!validToken) {
        return res.status(400).json({ error: "Token invalide ou expiré" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);
      await storage.updateUser(validToken.userId, { password: hashedPassword });
      
      await storage.deletePasswordResetTokenById(validToken.id);

      res.json({ success: true, message: "Mot de passe réinitialisé avec succès" });
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

      if (application.userId !== user.id && !(user as any).isAdmin) {
        return res.status(403).json({ error: "Accès refusé" });
      }

      res.json(application);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get documents for a loan application
  app.get("/api/loan-applications/:id/documents", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const application = await storage.getLoanApplication(req.params.id);
      
      if (!application) {
        return res.status(404).json({ error: "Demande non trouvée" });
      }

      if (application.userId !== user.id && !(user as any).isAdmin) {
        return res.status(403).json({ error: "Accès refusé" });
      }

      const documents = await storage.getDocumentsByLoanApplicationId(req.params.id);
      res.json(documents);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Upload document for a loan application
  app.post("/api/loan-applications/:id/documents", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const application = await storage.getLoanApplication(req.params.id);
      
      if (!application) {
        return res.status(404).json({ error: "Demande non trouvée" });
      }

      if (application.userId !== user.id) {
        return res.status(403).json({ error: "Accès refusé" });
      }

      const validatedData = uploadDocumentSchema.parse(req.body);

      const document = await storage.createDocument({
        userId: user.id,
        loanApplicationId: application.id,
        type: validatedData.type,
        fileName: validatedData.fileName,
        fileUrl: validatedData.fileUrl,
        status: "pending",
      });

      res.status(201).json(document);
    } catch (error: any) {
      if (error.errors) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Get user notifications
  app.get("/api/notifications", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const notifications = await storage.getNotificationsByUserId(user.id);
      res.json(notifications);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get unread notifications count
  app.get("/api/notifications/unread", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const unreadNotifications = await storage.getUnreadNotificationsByUserId(user.id);
      res.json({ count: unreadNotifications.length, notifications: unreadNotifications });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Mark notification as read
  app.patch("/api/notifications/:id/read", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const notification = await storage.getNotification(req.params.id);
      
      if (!notification) {
        return res.status(404).json({ error: "Notification non trouvée" });
      }

      if (notification.userId !== user.id) {
        return res.status(403).json({ error: "Accès refusé" });
      }

      const updatedNotification = await storage.markNotificationAsRead(req.params.id);
      res.json(updatedNotification);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Mark all notifications as read
  app.patch("/api/notifications/read-all", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      await storage.markAllNotificationsAsRead(user.id);
      res.json({ success: true });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get contract for a loan application
  app.get("/api/loan-applications/:id/contract", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const application = await storage.getLoanApplication(req.params.id);
      
      if (!application) {
        return res.status(404).json({ error: "Demande non trouvée" });
      }

      if (application.userId !== user.id && !(user as any).isAdmin) {
        return res.status(403).json({ error: "Accès refusé" });
      }

      const contract = await storage.getContractByLoanApplicationId(req.params.id);
      if (!contract) {
        return res.status(404).json({ error: "Contrat non trouvé" });
      }

      res.json(contract);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Secure PDF download endpoint
  app.get("/api/contracts/:id/pdf", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const contract = await storage.getContract(req.params.id);
      
      if (!contract) {
        return res.status(404).json({ error: "Contrat non trouvé" });
      }

      // Get the associated loan application to check access
      const application = await storage.getLoanApplication(contract.loanApplicationId);
      if (!application) {
        return res.status(404).json({ error: "Demande de prêt non trouvée" });
      }

      // Verify access: user must be the borrower or an admin
      if (application.userId !== user.id && !(user as any).isAdmin) {
        return res.status(403).json({ error: "Accès refusé" });
      }

      // Build the filename from the contract number
      const filename = `${contract.contractNumber}.pdf`;
      const filePath = path.join(process.cwd(), 'contracts', filename);
      
      // Check if file exists
      if (!fs.existsSync(filePath)) {
        return res.status(404).json({ error: "Fichier PDF non trouvé sur le serveur" });
      }

      // Set headers for PDF download
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${filename}"`);
      
      // Stream the file
      const fileStream = fs.createReadStream(filePath);
      fileStream.pipe(res);
      
      fileStream.on('error', (error) => {
        console.error('Error streaming PDF:', error);
        if (!res.headersSent) {
          res.status(500).json({ error: "Erreur lors de la lecture du fichier" });
        }
      });
    } catch (error: any) {
      console.error('Error serving PDF:', error);
      res.status(500).json({ error: error.message });
    }
  });

  // Upload signed contract
  app.post("/api/contracts/:id/sign", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const contract = await storage.getContract(req.params.id);
      
      if (!contract) {
        return res.status(404).json({ error: "Contrat non trouvé" });
      }

      const application = await storage.getLoanApplication(contract.loanApplicationId);
      if (!application || application.userId !== user.id) {
        return res.status(403).json({ error: "Accès refusé" });
      }

      const validatedData = signContractSchema.parse(req.body);

      const updatedContract = await storage.updateContractStatus(req.params.id, "signed", {
        signedFileUrl: validatedData.signedFileUrl,
        signedAt: new Date() as any,
      });

      // Create notification for user
      await storage.createNotification({
        userId: user.id,
        type: "success",
        title: "Contrat signé",
        message: "Votre contrat a été signé avec succès. Il est en attente de vérification par notre équipe.",
      });

      // Notify all admins that a contract needs verification
      const admins = await storage.getAllAdmins();
      for (const admin of admins) {
        await storage.createNotification({
          userId: admin.id,
          type: "request",
          title: "Nouveau contrat à vérifier",
          message: `Le contrat #${contract.contractNumber} a été signé par ${user.fullName} et nécessite une vérification.`,
          actionUrl: `/admin/contracts/${contract.id}`,
        });
      }

      res.json(updatedContract);
    } catch (error: any) {
      if (error.errors) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Get transfer codes for a loan application
  app.get("/api/loan-applications/:id/transfer-codes", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const application = await storage.getLoanApplication(req.params.id);
      
      if (!application) {
        return res.status(404).json({ error: "Demande non trouvée" });
      }

      if (application.userId !== user.id) {
        return res.status(403).json({ error: "Accès refusé" });
      }

      const codes = await storage.getTransferCodesByLoanApplicationId(req.params.id);
      
      // Don't send actual codes to client, only metadata
      const sanitizedCodes = codes.map(code => ({
        id: code.id,
        position: code.position,
        percentage: code.percentage,
        description: code.description,
        used: code.used,
        usedAt: code.usedAt,
      }));

      res.json(sanitizedCodes);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Get next transfer code
  app.get("/api/loan-applications/:id/next-transfer-code", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const application = await storage.getLoanApplication(req.params.id);
      
      if (!application) {
        return res.status(404).json({ error: "Demande non trouvée" });
      }

      if (application.userId !== user.id) {
        return res.status(403).json({ error: "Accès refusé" });
      }

      const nextCode = await storage.getNextTransferCode(req.params.id);
      
      if (!nextCode) {
        return res.json({ message: "Tous les codes ont été utilisés" });
      }

      // Don't send actual code, only metadata
      res.json({
        position: nextCode.position,
        percentage: nextCode.percentage,
        description: nextCode.description,
      });
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Validate transfer code
  app.post("/api/loan-applications/:id/validate-code", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const application = await storage.getLoanApplication(req.params.id);
      
      if (!application) {
        return res.status(404).json({ error: "Demande non trouvée" });
      }

      if (application.userId !== user.id) {
        return res.status(403).json({ error: "Accès refusé" });
      }

      const validatedData = validateCodeSchema.parse(req.body);

      const validatedCode = await storage.validateAndUseTransferCode(req.params.id, validatedData.code);
      
      if (!validatedCode) {
        return res.status(400).json({ 
          error: "Code invalide ou déjà utilisé",
          valid: false 
        });
      }

      // Update transfer progress
      await storage.updateLoanApplicationProgress(req.params.id, validatedCode.percentage);

      // Create success notification
      await storage.createNotification({
        userId: user.id,
        type: "success",
        title: "Code validé",
        message: `Code validé avec succès. Progression: ${validatedCode.percentage}%`,
      });

      res.json({ 
        valid: true,
        percentage: validatedCode.percentage,
        description: validatedCode.description,
        message: "Code validé avec succès"
      });
    } catch (error: any) {
      if (error.errors) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Get card orders
  app.get("/api/card-orders", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const cardOrders = await storage.getCardOrdersByUserId(user.id);
      res.json(cardOrders);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Create card order
  app.post("/api/card-orders", requireAuth, async (req, res) => {
    try {
      const user = req.user as User;
      const validatedData = createCardOrderSchema.parse(req.body);

      // Check if loan application is approved
      const application = await storage.getLoanApplication(validatedData.loanApplicationId);
      if (!application) {
        return res.status(404).json({ error: "Demande de prêt non trouvée" });
      }

      if (application.userId !== user.id) {
        return res.status(403).json({ error: "Accès refusé" });
      }

      if (application.status !== "approved") {
        return res.status(400).json({ 
          error: "La demande de prêt doit être approuvée pour commander une carte" 
        });
      }

      // Check if funds are available (transfer progress must be exactly 100%)
      if (application.transferProgress !== 100) {
        return res.status(400).json({ 
          error: "Les fonds doivent être entièrement transférés (100%) pour commander une carte" 
        });
      }

      const cardOrder = await storage.createCardOrder({
        userId: user.id,
        loanApplicationId: validatedData.loanApplicationId,
        cardType: validatedData.cardType,
        deliveryAddress: validatedData.deliveryAddress,
        status: "pending",
      });

      // Create notification
      await storage.createNotification({
        userId: user.id,
        type: "success",
        title: "Commande de carte",
        message: `Votre commande de carte ${validatedData.cardType} a été créée avec succès`,
      });

      res.status(201).json(cardOrder);
    } catch (error: any) {
      if (error.errors) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // ===== ADMIN ROUTES =====

  // Get all pending loan applications (Admin only)
  app.get("/api/admin/loan-applications", requireAdmin, async (req, res) => {
    try {
      const applications = await storage.getAllPendingLoanApplications();
      res.json(applications);
    } catch (error: any) {
      res.status(500).json({ error: error.message });
    }
  });

  // Review document (Admin only)
  app.patch("/api/admin/documents/:id/review", requireAdmin, async (req, res) => {
    try {
      const admin = req.user as User;
      const validatedData = reviewDocumentSchema.parse(req.body);

      if (validatedData.status === "rejected" && !validatedData.rejectionReason) {
        return res.status(400).json({ error: "Motif de rejet requis" });
      }

      const document = await storage.updateDocumentStatus(
        req.params.id, 
        validatedData.status, 
        admin.id, 
        validatedData.rejectionReason
      );

      if (!document) {
        return res.status(404).json({ error: "Document non trouvé" });
      }

      // Create notification for user
      await storage.createNotification({
        userId: document.userId,
        fromAdminId: admin.id,
        type: validatedData.status === "approved" ? "success" : "warning",
        title: validatedData.status === "approved" ? "Document approuvé" : "Document rejeté",
        message: validatedData.status === "approved" 
          ? `Votre document ${document.fileName} a été approuvé`
          : `Votre document ${document.fileName} a été rejeté: ${validatedData.rejectionReason}`,
      });

      res.json(document);
    } catch (error: any) {
      if (error.errors) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Approve loan application (Admin only)
  app.post("/api/admin/loan-applications/:id/approve", requireAdmin, async (req, res) => {
    try {
      const admin = req.user as User;
      const validatedData = approveRejectLoanSchema.parse(req.body);

      const application = await storage.getLoanApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ error: "Demande non trouvée" });
      }

      // Check all documents are approved
      const documents = await storage.getDocumentsByLoanApplicationId(req.params.id);
      const hasRejectedDocs = documents.some(doc => doc.status === "rejected");
      const hasPendingDocs = documents.some(doc => doc.status === "pending");

      if (hasRejectedDocs || hasPendingDocs) {
        return res.status(400).json({ 
          error: "Tous les documents doivent être approuvés avant d'approuver la demande" 
        });
      }

      // Update application status
      const updatedApplication = await storage.updateLoanApplicationStatus(
        req.params.id,
        "approved",
        validatedData.message || "Votre demande de prêt a été approuvée",
        admin.id
      );

      // Get user and loan type data for PDF generation
      const user = await storage.getUser(application.userId);
      if (!user) {
        return res.status(404).json({ error: "Utilisateur non trouvé" });
      }
      
      const loanType = await storage.getLoanType(application.loanTypeId);
      if (!loanType) {
        return res.status(404).json({ error: "Type de prêt non trouvé" });
      }

      // Generate contract
      const contractNumber = `CTR-${Date.now()}-${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
      
      // Generate PDF contract
      let pdfUrl: string;
      try {
        pdfUrl = await PDFGenerator.generateLoanContract({
          contractNumber,
          borrower: {
            fullName: user.fullName,
            email: user.email,
            phone: user.phone || undefined,
          },
          application: {
            applicationType: application.applicationType,
            amount: application.amount,
            durationMonths: application.durationMonths,
            estimatedRate: application.estimatedRate,
            estimatedMonthlyPayment: application.estimatedMonthlyPayment,
            purpose: application.purpose || undefined,
            monthlyIncome: application.monthlyIncome || undefined,
            employmentStatus: application.employmentStatus || undefined,
            companyName: application.companyName || undefined,
            siret: application.siret || undefined,
            companyRevenue: application.companyRevenue || undefined,
          },
          loanType: translateLoanType(loanType.nameKey, loanType.descriptionKey),
          generatedDate: new Date(),
        });
      } catch (pdfError: any) {
        console.error("PDF generation failed:", pdfError);
        return res.status(500).json({ 
          error: "Échec de la génération du contrat PDF", 
          details: pdfError.message 
        });
      }

      // Create the contract record with the API endpoint URL
      // The frontend will use this to access the PDF via the secure endpoint
      const contract = await storage.createContract({
        loanApplicationId: req.params.id,
        contractNumber,
        fileUrl: `/api/contracts/PLACEHOLDER/pdf`,
        status: "generated",
        generatedBy: admin.id,
      });
      
      // Update with the actual contract ID in the URL
      await storage.updateContractStatus(contract.id, "generated", {
        fileUrl: `/api/contracts/${contract.id}/pdf`,
      });

      // Link contract to application
      await storage.updateLoanApplicationContract(req.params.id, contract.id);

      // Generate 5 transfer codes
      const percentages = [20, 40, 60, 80, 100];
      const descriptions = [
        "Frais de dossier",
        "Deuxième versement",
        "Troisième versement",
        "Quatrième versement",
        "Versement final"
      ];

      for (let i = 0; i < 5; i++) {
        const code = Math.random().toString(36).substr(2, 8).toUpperCase();
        await storage.createTransferCode({
          loanApplicationId: req.params.id,
          code,
          position: i + 1,
          percentage: percentages[i],
          description: descriptions[i],
          used: false,
        });
      }

      // Create notification for user
      await storage.createNotification({
        userId: application.userId,
        fromAdminId: admin.id,
        type: "success",
        title: "Demande approuvée",
        message: validatedData.message || "Votre demande de prêt a été approuvée. Votre contrat est disponible.",
        actionUrl: `/dashboard/applications/${req.params.id}`,
      });

      res.json({ 
        application: updatedApplication,
        contract 
      });
    } catch (error: any) {
      if (error.errors) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Reject loan application (Admin only)
  app.post("/api/admin/loan-applications/:id/reject", requireAdmin, async (req, res) => {
    try {
      const admin = req.user as User;
      const validatedData = z.object({ message: z.string().min(1, "Motif de rejet requis") }).parse(req.body);

      const application = await storage.getLoanApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ error: "Demande non trouvée" });
      }

      const updatedApplication = await storage.updateLoanApplicationStatus(
        req.params.id,
        "rejected",
        validatedData.message,
        admin.id
      );

      // Create notification for user
      await storage.createNotification({
        userId: application.userId,
        fromAdminId: admin.id,
        type: "error",
        title: "Demande rejetée",
        message: `Votre demande de prêt a été rejetée: ${validatedData.message}`,
        actionUrl: `/dashboard/applications/${req.params.id}`,
      });

      res.json(updatedApplication);
    } catch (error: any) {
      if (error.errors) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Request more information (Admin only)
  app.post("/api/admin/loan-applications/:id/request-info", requireAdmin, async (req, res) => {
    try {
      const admin = req.user as User;
      const validatedData = requestInfoSchema.parse(req.body);

      const application = await storage.getLoanApplication(req.params.id);
      if (!application) {
        return res.status(404).json({ error: "Demande non trouvée" });
      }

      // Update status to under_review
      await storage.updateLoanApplicationStatus(
        req.params.id,
        "under_review",
        "Informations supplémentaires requises",
        admin.id
      );

      // Create notification for user
      await storage.createNotification({
        userId: application.userId,
        fromAdminId: admin.id,
        type: "request",
        title: "Informations supplémentaires requises",
        message: validatedData.message,
        actionUrl: `/dashboard/applications/${req.params.id}`,
      });

      res.json({ success: true, message: "Demande d'informations envoyée" });
    } catch (error: any) {
      if (error.errors) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Verify signed contract (Admin only)
  app.post("/api/admin/contracts/:id/verify", requireAdmin, async (req, res) => {
    try {
      const admin = req.user as User;
      const validatedData = verifyContractSchema.parse(req.body);

      if (validatedData.status === "rejected" && !validatedData.rejectionReason) {
        return res.status(400).json({ error: "Motif de rejet requis" });
      }

      const contract = await storage.getContract(req.params.id);
      if (!contract) {
        return res.status(404).json({ error: "Contrat non trouvé" });
      }

      const application = await storage.getLoanApplication(contract.loanApplicationId);
      if (!application) {
        return res.status(404).json({ error: "Demande non trouvée" });
      }

      const updatedContract = await storage.updateContractStatus(req.params.id, validatedData.status, {
        verifiedBy: admin.id,
        verifiedAt: new Date() as any,
        rejectionReason: validatedData.rejectionReason,
      });

      // Create notification for user
      await storage.createNotification({
        userId: application.userId,
        fromAdminId: admin.id,
        type: validatedData.status === "verified" ? "success" : "warning",
        title: validatedData.status === "verified" ? "Contrat vérifié" : "Contrat rejeté",
        message: validatedData.status === "verified"
          ? "Votre contrat a été vérifié. Le processus de transfert peut commencer."
          : `Votre contrat a été rejeté: ${validatedData.rejectionReason}. Veuillez le resigner.`,
        actionUrl: `/dashboard/applications/${contract.loanApplicationId}`,
      });

      res.json(updatedContract);
    } catch (error: any) {
      if (error.errors) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: error.message });
    }
  });

  // Update card order status (Admin only)
  app.patch("/api/admin/card-orders/:id/status", requireAdmin, async (req, res) => {
    try {
      const validatedData = updateCardOrderStatusSchema.parse(req.body);

      const updates: any = { status: validatedData.status };
      if (validatedData.trackingNumber) updates.trackingNumber = validatedData.trackingNumber;
      if (validatedData.status === "shipped") updates.shippedAt = new Date();
      if (validatedData.status === "delivered") updates.deliveredAt = new Date();

      const cardOrder = await storage.updateCardOrderStatus(req.params.id, validatedData.status, updates);
      
      if (!cardOrder) {
        return res.status(404).json({ error: "Commande non trouvée" });
      }

      // Create notification for user
      let message = "Le statut de votre commande de carte a été mis à jour";
      if (validatedData.status === "shipped") {
        message = `Votre carte a été expédiée. Numéro de suivi: ${validatedData.trackingNumber}`;
      } else if (validatedData.status === "delivered") {
        message = "Votre carte a été livrée";
      }

      await storage.createNotification({
        userId: cardOrder.userId,
        type: "info",
        title: "Commande de carte",
        message,
      });

      res.json(cardOrder);
    } catch (error: any) {
      if (error.errors) {
        return res.status(400).json({ error: error.errors[0].message });
      }
      res.status(500).json({ error: error.message });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
