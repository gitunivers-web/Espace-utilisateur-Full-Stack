# Altus Finance Group - Plateforme de Prêt en Ligne

## Overview
Altus Finance Group offers a comprehensive online lending platform for individuals and professionals. It provides personalized loans, online simulation tools, a multi-step loan application process, and a secure client area ("Mon Espace"). The platform's vision is to streamline access to various loan products with a user-friendly and robust digital experience, targeting a broad market with diverse financial needs.

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
    -   Online loan simulation with real-time calculations.
    -   Multi-step loan application forms with distinct flows for individuals and professionals, leveraging Zod for validation (including discriminated unions).
    -   Secure client area ("Mon Espace") for managing loan applications, tracking history, and accessing account settings.
    -   Public-facing website with marketing content, loan offers catalog, and standalone simulator.
    -   Comprehensive user authentication system including login, distinct registration paths (individual/professional), email verification, and secure password reset mechanism via email.
    -   Responsive design and accessibility considerations (e.g., `data-testid`).

## External Dependencies
-   **PostgreSQL**: Primary database for all application data, hosted on Render.
-   **Resend API**: Used for sending transactional emails, including email verification for new users and password reset functionality. Falls back to console logging when API key is not configured (development mode).
-   **React Query**: For efficient server state management and data fetching in the frontend.
-   **i18next & react-i18next**: For internationalization and localization of the user interface.
-   **Drizzle ORM**: Object-Relational Mapper for interacting with the PostgreSQL database.
-   **bcrypt**: For hashing and comparing sensitive data like password reset tokens.
-   **Zod**: Schema declaration and validation library, used for robust data validation on both frontend and backend.