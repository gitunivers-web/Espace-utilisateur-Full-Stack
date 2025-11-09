import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";
import { LegalNoticeBanner } from "@/components/legal/LegalNotice";
import { LanguageSelector } from "@/components/LanguageSelector";
import { useTranslation } from "react-i18next";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { t } = useTranslation();

  const navigation = [
    { name: t('nav.home'), href: "/" },
    { name: t('nav.offers'), href: "/offres" },
    { name: t('nav.simulator'), href: "/simulateur" },
    { name: t('nav.howItWorks'), href: "/comment-ca-marche" },
    { name: t('nav.about'), href: "/a-propos" },
    { name: t('nav.contact'), href: "/contact" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-background border-b">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/">
                <div className="flex items-center gap-2 cursor-pointer">
                  <div className="text-2xl font-bold text-primary">Altus Finance</div>
                </div>
              </Link>
              
              <div className="hidden md:flex items-center gap-1">
                {navigation.map((item) => (
                  <Link key={item.name} href={item.href}>
                    <div
                      className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover-elevate min-h-9 px-4 py-2 ${
                        location === item.href ? "bg-accent" : ""
                      }`}
                      data-testid={`link-nav-${item.name.toLowerCase().replace(/ /g, '-')}`}
                    >
                      {item.name}
                    </div>
                  </Link>
                ))}
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <LanguageSelector />
              <Link href="/auth/connexion">
                <div
                  className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover-elevate min-h-9 px-4 py-2 bg-primary text-primary-foreground"
                  data-testid="button-demander-pret"
                >
                  {t('nav.createAccount')}
                </div>
              </Link>
            </div>

            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              data-testid="button-mobile-menu"
            >
              {mobileMenuOpen ? <X /> : <Menu />}
            </button>
          </div>

          {mobileMenuOpen && (
            <div className="md:hidden py-4 space-y-2">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <div
                    className={`inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover-elevate min-h-9 px-4 py-2 w-full justify-start ${
                      location === item.href ? "bg-accent" : ""
                    }`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </div>
                </Link>
              ))}
              <div className="pt-4 space-y-2">
                <div className="px-4 py-2">
                  <LanguageSelector />
                </div>
                <Link href="/auth/connexion">
                  <div
                    className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors hover-elevate min-h-9 px-4 py-2 w-full bg-primary text-primary-foreground"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {t('nav.createAccount')}
                  </div>
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>

      <LegalNoticeBanner />

      <main className="flex-1">{children}</main>

      <footer className="bg-card border-t mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="mb-8 p-6 bg-muted/50 rounded-md">
            <p className="text-sm font-semibold text-center">
              {t('legal.warning')}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-xl font-bold text-primary mb-4">{t('app.name')}</div>
              <p className="text-sm text-muted-foreground">
                {t('footer.tagline')}
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">{t('footer.ourLoans')}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/offres?type=personnel"><span className="hover:text-foreground cursor-pointer">{t('footer.personalLoan')}</span></Link></li>
                <li><Link href="/offres?type=auto"><span className="hover:text-foreground cursor-pointer">{t('footer.autoLoan')}</span></Link></li>
                <li><Link href="/offres?type=travaux"><span className="hover:text-foreground cursor-pointer">{t('footer.renovationLoan')}</span></Link></li>
                <li><Link href="/offres?type=pro"><span className="hover:text-foreground cursor-pointer">{t('footer.businessLoan')}</span></Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">{t('footer.help')}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/comment-ca-marche"><span className="hover:text-foreground cursor-pointer">{t('nav.howItWorks')}</span></Link></li>
                <li><Link href="/contact"><span className="hover:text-foreground cursor-pointer">{t('nav.contact')}</span></Link></li>
                <li><Link href="/a-propos"><span className="hover:text-foreground cursor-pointer">{t('nav.about')}</span></Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">{t('footer.legal')}</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/mentions-legales"><span className="hover:text-foreground cursor-pointer" data-testid="link-mentions-legales">{t('footer.legalNotice')}</span></Link></li>
                <li><Link href="/politique-confidentialite"><span className="hover:text-foreground cursor-pointer" data-testid="link-privacy-policy">{t('footer.privacyPolicy')}</span></Link></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} {t('app.name')} Group. {t('footer.copyright')}.
          </div>
        </div>
      </footer>
    </div>
  );
}
