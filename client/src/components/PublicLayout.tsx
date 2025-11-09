import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export function PublicLayout({ children }: { children: React.ReactNode }) {
  const [location] = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: "Accueil", href: "/" },
    { name: "Nos Offres", href: "/offres" },
    { name: "Simulateur", href: "/simulateur" },
    { name: "Comment ça marche", href: "/comment-ca-marche" },
    { name: "À propos", href: "/a-propos" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <header className="sticky top-0 z-50 bg-background border-b">
        <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            <div className="flex items-center gap-8">
              <Link href="/">
                <a className="flex items-center gap-2">
                  <div className="text-2xl font-bold text-primary">Altus Finance</div>
                </a>
              </Link>
              
              <div className="hidden md:flex items-center gap-1">
                {navigation.map((item) => (
                  <Link key={item.name} href={item.href}>
                    <Button
                      variant="ghost"
                      className={location === item.href ? "bg-accent" : ""}
                      data-testid={`link-nav-${item.name.toLowerCase().replace(/ /g, '-')}`}
                    >
                      {item.name}
                    </Button>
                  </Link>
                ))}
              </div>
            </div>

            <div className="hidden md:flex items-center gap-2">
              <Link href="/auth/connexion">
                <Button variant="ghost" data-testid="button-connexion">
                  Connexion
                </Button>
              </Link>
              <Link href="/demande">
                <Button data-testid="button-demander-pret">
                  Demander un prêt
                </Button>
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
                  <Button
                    variant="ghost"
                    className={`w-full justify-start ${location === item.href ? "bg-accent" : ""}`}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    {item.name}
                  </Button>
                </Link>
              ))}
              <div className="pt-4 space-y-2">
                <Link href="/auth/connexion">
                  <Button variant="ghost" className="w-full" onClick={() => setMobileMenuOpen(false)}>
                    Connexion
                  </Button>
                </Link>
                <Link href="/demande">
                  <Button className="w-full" onClick={() => setMobileMenuOpen(false)}>
                    Demander un prêt
                  </Button>
                </Link>
              </div>
            </div>
          )}
        </nav>
      </header>

      <main className="flex-1">{children}</main>

      <footer className="bg-card border-t mt-auto">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <div className="text-xl font-bold text-primary mb-4">Altus Finance</div>
              <p className="text-sm text-muted-foreground">
                Votre partenaire de confiance pour tous vos projets de financement
              </p>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Nos Prêts</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/offres?type=personnel"><a className="hover:text-foreground">Prêt Personnel</a></Link></li>
                <li><Link href="/offres?type=auto"><a className="hover:text-foreground">Crédit Auto</a></Link></li>
                <li><Link href="/offres?type=travaux"><a className="hover:text-foreground">Prêt Travaux</a></Link></li>
                <li><Link href="/offres?type=pro"><a className="hover:text-foreground">Prêt Professionnel</a></Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Aide</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><Link href="/comment-ca-marche"><a className="hover:text-foreground">Comment ça marche</a></Link></li>
                <li><Link href="/faq"><a className="hover:text-foreground">FAQ</a></Link></li>
                <li><Link href="/contact"><a className="hover:text-foreground">Contact</a></Link></li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold mb-4">Légal</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li><a href="#" className="hover:text-foreground">Mentions légales</a></li>
                <li><a href="#" className="hover:text-foreground">Politique de confidentialité</a></li>
                <li><a href="#" className="hover:text-foreground">CGU</a></li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Altus Finance Group. Tous droits réservés.
          </div>
        </div>
      </footer>
    </div>
  );
}
