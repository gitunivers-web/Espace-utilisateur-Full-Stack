import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X, User, Globe } from "lucide-react";
import { useState } from "react";
import { LegalNoticeBanner } from "@/components/legal/LegalNotice";
import { useTranslation } from "react-i18next";
import { useAuth } from "@/lib/api";
import { SolventisLogo } from "@/components/SolventisLogo";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const languages = [
  { code: 'fr', name: 'Français', flag: 'FR' },
  { code: 'en', name: 'English', flag: 'EN' },
  { code: 'pt', name: 'Português', flag: 'PT' },
  { code: 'es', name: 'Español', flag: 'ES' },
  { code: 'it', name: 'Italiano', flag: 'IT' },
  { code: 'hu', name: 'Magyar', flag: 'HU' },
  { code: 'pl', name: 'Polski', flag: 'PL' },
];

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const { data: auth } = useAuth();

  const navigation = [
    { name: t('nav.home'), href: "/" },
    { name: t('nav.offers'), href: "/offres" },
    { name: t('nav.howItWorks'), href: "/comment-ca-marche" },
    { name: t('nav.about'), href: "/a-propos" },
    { name: t('nav.contact'), href: "/contact" },
  ];

  const currentLanguage = languages.find(lang => lang.code === i18n.language) || languages[0];

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Premium Fintech Header */}
      <header className="sticky top-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border/50">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between gap-4">
            {/* Logo - Left */}
            <Link href="/">
              <div className="flex items-center gap-2 cursor-pointer">
                <SolventisLogo showText={true} size="md" />
              </div>
            </Link>
            
            {/* Navigation - Center */}
            <div className="hidden lg:flex items-center justify-center flex-1">
              <div className="flex items-center gap-1">
                {navigation.map((item) => (
                  <Link key={item.name} href={item.href}>
                    <div
                      className={`inline-flex items-center justify-center whitespace-nowrap text-sm font-medium transition-all duration-200 px-4 py-2 rounded-md ${
                        location === item.href 
                          ? "text-foreground bg-muted" 
                          : "text-muted-foreground hover:text-foreground"
                      }`}
                      data-testid={`link-nav-${item.name.toLowerCase().replace(/ /g, '-')}`}
                    >
                      {item.name}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Side - Language + CTA */}
            <div className="hidden md:flex items-center gap-3">
              {/* Compact Language Selector */}
              <Select value={i18n.language} onValueChange={(code) => i18n.changeLanguage(code)}>
                <SelectTrigger className="w-auto gap-2 border-0 bg-transparent shadow-none" data-testid="select-language">
                  <Globe className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm font-medium">{currentLanguage.flag}</span>
                </SelectTrigger>
                <SelectContent align="end">
                  {languages.map((language) => (
                    <SelectItem 
                      key={language.code} 
                      value={language.code}
                      data-testid={`language-option-${language.code}`}
                    >
                      {language.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {auth?.user ? (
                <Link href="/mon-espace">
                  <Button variant="default" className="gap-2" data-testid="button-mon-espace">
                    <User className="w-4 h-4" />
                    {t('nav.mySpace')}
                  </Button>
                </Link>
              ) : (
                <Link href="/auth/connexion">
                  <Button variant="default" data-testid="button-demander-pret">
                    {t('nav.applyLoan')}
                  </Button>
                </Link>
              )}
            </div>

            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-md hover:bg-muted transition-colors"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="lg:hidden py-4 space-y-1 border-t border-border/50" data-testid="mobile-menu">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <div
                    className={`block px-4 py-3 text-sm font-medium rounded-md transition-colors ${
                      location === item.href 
                        ? "text-foreground bg-muted" 
                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                    data-testid={`mobile-nav-${item.name.toLowerCase().replace(/ /g, '-')}`}
                  >
                    {item.name}
                  </div>
                </Link>
              ))}
              <div className="pt-4 space-y-3 border-t border-border/50 mt-2">
                <div className="px-4">
                  <Select value={i18n.language} onValueChange={(code) => i18n.changeLanguage(code)}>
                    <SelectTrigger className="w-full" data-testid="select-language-mobile">
                      <div className="flex items-center gap-2">
                        <Globe className="h-4 w-4" />
                        <SelectValue>{currentLanguage.name}</SelectValue>
                      </div>
                    </SelectTrigger>
                    <SelectContent>
                      {languages.map((language) => (
                        <SelectItem key={language.code} value={language.code}>
                          {language.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="px-4">
                  {auth?.user ? (
                    <Link href="/mon-espace">
                      <Button 
                        variant="default" 
                        className="w-full gap-2"
                        onClick={() => setMobileMenuOpen(false)}
                        data-testid="button-mobile-mon-espace"
                      >
                        <User className="w-4 h-4" />
                        {t('nav.mySpace')}
                      </Button>
                    </Link>
                  ) : (
                    <Link href="/auth/connexion">
                      <Button 
                        variant="default" 
                        className="w-full"
                        onClick={() => setMobileMenuOpen(false)}
                        data-testid="button-mobile-apply-loan"
                      >
                        {t('nav.applyLoan')}
                      </Button>
                    </Link>
                  )}
                </div>
              </div>
            </div>
          )}
        </nav>
      </header>

      <LegalNoticeBanner />

      <main className="flex-1">{children}</main>

      {/* Premium Footer */}
      <footer className="bg-muted/30 border-t mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
          {/* Legal Warning */}
          <div className="mb-12 p-6 bg-muted/50 rounded-lg border border-border/50">
            <p className="text-sm text-muted-foreground text-center">
              {t('legal.warning')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
            {/* Brand Column */}
            <div className="space-y-4">
              <SolventisLogo showText={true} size="md" />
              <p className="text-sm text-muted-foreground leading-relaxed">
                {t('footer.tagline')}
              </p>
            </div>

            {/* Loans Column */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">{t('footer.ourLoans')}</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/offres?type=personnel">
                    <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                      {t('footer.personalLoan')}
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/offres?type=auto">
                    <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                      {t('footer.autoLoan')}
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/offres?type=travaux">
                    <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                      {t('footer.renovationLoan')}
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/offres?type=pro">
                    <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                      {t('footer.businessLoan')}
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Help Column */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">{t('footer.help')}</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/comment-ca-marche">
                    <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                      {t('nav.howItWorks')}
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/contact">
                    <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                      {t('nav.contact')}
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/a-propos">
                    <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer">
                      {t('nav.about')}
                    </span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div>
              <h3 className="font-semibold text-foreground mb-4">{t('footer.legal')}</h3>
              <ul className="space-y-3">
                <li>
                  <Link href="/mentions-legales">
                    <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer" data-testid="link-mentions-legales">
                      {t('footer.legalNotice')}
                    </span>
                  </Link>
                </li>
                <li>
                  <Link href="/politique-confidentialite">
                    <span className="text-sm text-muted-foreground hover:text-foreground transition-colors cursor-pointer" data-testid="link-privacy-policy">
                      {t('footer.privacyPolicy')}
                    </span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>

          {/* Copyright */}
          <div className="mt-12 pt-8 border-t border-border/50 text-center">
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} {t('app.name')} Group. {t('footer.copyright')}.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
