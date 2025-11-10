# Lendia Group - Plateforme de Prêt en Ligne

## Overview
Lendia Group offers a comprehensive online lending platform for individuals and professionals. It provides personalized loans, online simulation tools, a multi-step loan application process, and a secure client area ("Mon Espace"). The platform's vision is to streamline access to various loan products with a user-friendly and robust digital experience, targeting a broad market with diverse financial needs.

## User Preferences
- Style de code: TypeScript strict, composants fonctionnels React
- Framework UI: shadcn/ui avec Tailwind CSS
- Gestion d'état: React Query pour serveur, Zustand pour local
- Base de données: PostgreSQL avec Drizzle ORM (pas de Prisma)

## System Architecture
The platform is built with a modern web stack.
-   **Frontend**: React 18 with TypeScript and Vite.
    -   **UI/UX**: Utilizes `shadcn/ui` components styled with Tailwind CSS for a consistent and responsive design across all devices (mobile, tablet, desktop).
    -   **State Management**: React Query is used for server-side data fetching and caching, while Zustand is preferred for local state management.
    -   **Routing**: Implements a dual-layout architecture (`PublicLayout` for marketing and public-facing pages, `ProtectedRouter` for authenticated user dashboards like "Mon Espace") ensuring clear separation of concerns.
    -   **Internationalization (i18n)**: Full support for 7 languages (French, English, Portuguese, Spanish, Italian, Hungarian, Polish) using `i18next` and `react-i18next`, with all hardcoded strings converted to localized keys.
-   **Backend**: Express.js with TypeScript.
    -   **API**: Provides RESTful endpoints for loan types, simulations, applications, user management, authentication, and password reset functionalities. Endpoints are categorized into public and protected access.
-   **Database**: PostgreSQL hosted on Render, managed with Drizzle ORM and the `pg` driver.
    -   **Schema**: Includes `users`, `accounts`, `cards`, `loans`, `transactions`, `loan_types`, `loan_simulations`, `loan_applications`, and `password_reset_tokens`. Features PostgreSQL enums and foreign keys with appropriate CASCADE/RESTRICT rules.
    -   **Data Seeding**: Contains realistic loan types for the French market (2024-2025) and demo user data.
-   **Security**: 
    -   Password reset tokens are hashed using bcrypt and have an automatic expiration of 1 hour.
    -   Email verification tokens expire after 24 hours for enhanced security.
    -   User authentication is managed securely, and sensitive operations are protected.
-   **Core Features**:
    -   **Email Verification Flow**: New users must verify their email address before accessing their account. Upon registration, a verification email is sent with a unique token (24h expiration). Users click the verification link, which validates the token and automatically logs them into their dashboard.
    -   **Automatic PDF Contract Generation**: When admins approve a loan application, the system automatically generates a professional PDF contract with all loan details, borrower information, and terms & conditions. Contracts are stored securely and accessible only to the borrower and admins via authenticated endpoints.
    -   Online loan simulation with real-time calculations.
    -   Multi-step loan application forms with distinct flows for individuals and professionals, leveraging Zod for validation (including discriminated unions).
    -   Secure client area ("Mon Espace") for managing loan applications, tracking history, accessing contracts, and account settings.
    -   Admin dashboard for managing all loan applications with approve/reject/request-info actions.
    -   Public-facing website with marketing content, loan offers catalog, and standalone simulator.
    -   Comprehensive user authentication system including login, distinct registration paths (individual/professional), email verification, and secure password reset mechanism via email.
    -   Responsive design and accessibility considerations (e.g., `data-testid`).

## Recent Changes (November 10, 2025)

### Fonctionnalités Complétées
1. **Système d'upload de photo de profil sécurisé**
   - Configuration multer pour gérer les uploads (JPEG, PNG, WEBP, max 5MB)
   - Route protégée POST /api/user/profile-picture pour uploader
   - Route protégée GET /api/user/profile-picture/:filename pour servir les fichiers
   - Interface utilisateur dans Parametres.tsx avec prévisualisation et gestion d'erreurs
   - Validation côté serveur et stockage dans public/uploads/profile-pictures/

2. **Dashboard Admin complet**
   - Nouvelle page client/src/pages/admin-dashboard.tsx pour gérer toutes les demandes de prêt
   - Interface avec filtres et recherche en temps réel
   - Actions admin: Approuver, Rejeter, Demander plus d'infos
   - Routes API: GET /api/admin/loan-applications, POST /api/admin/loan-applications/:id/approve, POST /api/admin/loan-applications/:id/reject, POST /api/admin/loan-applications/:id/request-info
   - Hooks React Query dans client/src/lib/api.ts pour gérer les mutations

3. **Système de gestion des documents KYC sécurisé**
   - Configuration multer pour documents (PDF, images, max 10MB)
   - Route protégée POST /api/documents/upload avec validation d'autorisation
   - Route protégée GET /api/documents/file/:filename avec vérification de propriété
   - Validation que le loanApplicationId appartient à l'utilisateur (ou admin)
   - Stockage sécurisé dans public/uploads/documents/
   - Les documents ne sont accessibles que par leur propriétaire ou les admins

4. **Génération automatique de contrats PDF**
   - Service de génération PDF professionnel utilisant PDFKit (server/services/pdfGenerator.ts)
   - Template de contrat complet avec en-tête, informations emprunteur, détails du prêt, conditions générales, section signature
   - Service de traduction i18n pour les noms de types de prêt (server/services/loanTypeTranslations.ts)
   - Intégration dans le workflow d'approbation admin : génération automatique lors de l'approbation
   - Route sécurisée GET /api/contracts/:id/pdf avec authentification et vérification d'autorisation
   - Stockage des fichiers PDF dans le dossier contracts/
   - Les contrats ne sont accessibles que par l'emprunteur ou les admins
   - Génération automatique de 5 codes de transfert avec chaque approbation (20%, 40%, 60%, 80%, 100%)

### Sécurité
- **Uploads protégés**: Tous les fichiers uploadés sont maintenant servis via des routes protégées avec authentification
- **Validation d'autorisation**: Vérification que les utilisateurs ne peuvent accéder qu'à leurs propres documents
- **Pas de serving statique**: Retrait du serving statique public de /uploads et /contracts pour empêcher l'accès non autorisé
- **Validation des données**: Utilisation des schémas Zod pour valider toutes les entrées utilisateur
- **Contrats PDF sécurisés**: Accès aux contrats uniquement via endpoint authentifié avec vérification emprunteur/admin

### Architecture
- **Multer**: Gestion des uploads de fichiers avec validation de type et taille
- **PDFKit**: Génération de contrats PDF professionnels côté serveur
- **Routes protégées**: Toutes les routes sensibles requièrent l'authentification
- **Separation of concerns**: Les routes admin sont séparées des routes utilisateur
- **Services modulaires**: Services séparés pour génération PDF et traductions i18n

## External Dependencies
-   **PostgreSQL**: Primary database for all application data, hosted on Render.
-   **Resend API**: Used for sending transactional emails, including email verification for new users and password reset functionality. Falls back to console logging when API key is not configured (development mode).
-   **React Query**: For efficient server state management and data fetching in the frontend.
-   **i18next & react-i18next**: For internationalization and localization of the user interface.
-   **Drizzle ORM**: Object-Relational Mapper for interacting with the PostgreSQL database.
-   **bcrypt**: For hashing and comparing sensitive data like password reset tokens.
-   **Zod**: Schema declaration and validation library, used for robust data validation on both frontend and backend.
-   **Multer**: For handling multipart/form-data file uploads.
-   **PDFKit**: For server-side PDF contract generation with professional formatting.