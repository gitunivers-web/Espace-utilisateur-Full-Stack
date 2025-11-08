# Design Guidelines: Altus Finance Group Banking Dashboard

## Design Approach
Professional banking application inspired by modern fintech platforms like Qonto and Hello Bank. Premium, trustworthy aesthetic with sophisticated visual design befitting a high-end digital bank.

## Visual Identity

### Color Palette
- **Primary Accent**: Bleu royal #0B3CFF
- **Backgrounds**: White #FFFFFF, Light gray #F5F7FA
- **Dark Theme**: Dark gray #1E293B
- **Premium Accents**: Gold #D4AF37 (for special buttons and highlights)

### Typography
- **Font Families**: Inter, Poppins, or Manrope
- **Style**: Clean, modern, professional
- **Hierarchy**: Clear distinction between headings, body text, and financial data

### Visual Effects
- Subtle shadows for depth
- Rounded corners (rounded-2xl)
- Smooth transitions and animations throughout
- Glassmorphism effect on virtual card and select UI cards
- 3D effect on virtual bank card with hover animations

## Layout System

### Spacing
Use Tailwind spacing units: 2, 4, 6, 8, 12, 16, 20, 24 for consistent rhythm

### Core Layout Structure

**Sidebar (Fixed Left)**
- Medium-sized Altus Finance Group logo at top
- Primary navigation with icons:
  - Tableau de bord
  - Comptes & Cartes
  - Prêts & Financements
  - Transferts
  - Historique
  - Paramètres
- Light/Dark theme toggle (moon icon)
- User profile card at bottom
- Logout button

**Topbar (Fixed Top)**
- Welcome message: "Bonjour, [Prénom] 👋"
- Right-aligned icons:
  - 🔔 Notifications
  - 🌐 Language selector (FR/EN)
  - Avatar with dropdown menu

**InfoTicker (Always Visible)**
- Positioned at top of dashboard content
- Smooth scrolling banner
- Messages: promotional offers, security features, trust signals
- Example: "Nouvelle offre : 0% frais sur vos premiers transferts 💸"

## Component Library

### Dashboard Cards
**Statistics Cards** (4 cards grid):
- Solde actuel
- Crédit disponible
- Capacité d'emprunt (with progress bar)
- Total emprunté
- Clean card design with rounded corners and subtle shadows

**Virtual Bank Card**
- Right side of dashboard
- 3D glassmorphism effect
- Displays card holder name and partial account number
- Hover animation
- Premium finish matching brand identity

### Charts & Graphs
**Quick Overview Section**
- Interactive charts using Recharts
- Revenue, expenses, loan repayments visualization
- Clean, professional data presentation
- Responsive and filterable

### Transaction History
- Filterable table
- Search functionality
- Clear date, amount, category columns
- Professional financial data display

### Secondary Pages Structure
**Comptes & Cartes**: Card management, account details
**Prêts & Financements**: Loan overview, repayment schedules
**Transferts**: Transfer interface with quick actions
**Paramètres**: Profile settings, 2FA activation, KYC document upload

## Responsive Design
- **Desktop**: Full sidebar, multi-column layouts
- **Tablet**: Collapsible sidebar, 2-column where appropriate
- **Mobile**: Hidden sidebar (hamburger menu), single column, touch-optimized

## Interaction Design
- Smooth page transitions
- Micro-animations on hover states
- Loading states for data fetching
- Clear feedback for user actions
- Professional, subtle animation throughout (Framer Motion)

## Theme Support
- **Light Theme**: Default, bright and clean
- **Dark Theme**: #1E293B base, adjusted colors for contrast
- Seamless theme switching without layout shift
- Both themes maintain premium aesthetic

## Trust & Security Elements
- Prominent display of security features in InfoTicker
- Professional visual treatment of financial data
- Clear hierarchy emphasizing important information
- Confidence-inspiring button styles and interactions

## Images
No hero images required - this is a banking dashboard application, not a marketing site. Focus on clean UI, data visualization, and the glassmorphic virtual card as the primary visual element.