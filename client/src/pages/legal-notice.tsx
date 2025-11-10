import { Card, CardContent } from "@/components/ui/card";

export default function LegalNotice() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Mentions Légales</h1>
          <p className="text-muted-foreground">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Informations légales</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Raison sociale</h3>
                  <p className="text-muted-foreground">Lendia Group SAS</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Siège social</h3>
                  <p className="text-muted-foreground">
                    123 Avenue des Champs-Élysées<br />
                    75008 Paris, France
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Forme juridique</h3>
                  <p className="text-muted-foreground">Société par Actions Simplifiée (SAS)</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Capital social</h3>
                  <p className="text-muted-foreground">500 000 €</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">SIREN / SIRET</h3>
                  <p className="text-muted-foreground">123 456 789 00012</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">RCS</h3>
                  <p className="text-muted-foreground">Paris B 123 456 789</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Numéro de TVA intracommunautaire</h3>
                  <p className="text-muted-foreground">FR 12 123456789</p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Activité réglementée</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Agrément</h3>
                  <p className="text-muted-foreground">
                    Lendia Group est un établissement de crédit agréé par l'Autorité de Contrôle Prudentiel et de Résolution (ACPR).
                  </p>
                  <p className="text-muted-foreground mt-2">
                    Numéro d'agrément ACPR : 12345
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Autorité de contrôle</h3>
                  <p className="text-muted-foreground">
                    Autorité de Contrôle Prudentiel et de Résolution (ACPR)<br />
                    4 Place de Budapest<br />
                    CS 92459<br />
                    75436 Paris Cedex 09<br />
                    <a href="https://acpr.banque-france.fr" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                      https://acpr.banque-france.fr
                    </a>
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Médiateur de la consommation</h3>
                  <p className="text-muted-foreground">
                    En cas de litige, vous pouvez recourir gratuitement au médiateur de la consommation :<br />
                    Médiateur de l'AMF<br />
                    Autorité des Marchés Financiers<br />
                    17 place de la Bourse<br />
                    75082 Paris Cedex 02<br />
                    <a href="http://www.amf-france.org" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                      www.amf-france.org
                    </a>
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Directeur de la publication</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">
                  Le directeur de la publication du site est M. Jean Dupont, Président de la SAS Lendia Group.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Hébergement</h2>
            <Card>
              <CardContent className="p-6 space-y-2">
                <p className="text-muted-foreground">
                  Le site www.lendia.fr est hébergé par :
                </p>
                <p className="text-muted-foreground">
                  Replit, Inc.<br />
                  548 Market St PMB 62930<br />
                  San Francisco, CA 94104<br />
                  États-Unis
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Propriété intellectuelle</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground">
                  L'ensemble de ce site relève de la législation française et internationale sur le droit d'auteur et la propriété intellectuelle. 
                  Tous les droits de reproduction sont réservés, y compris pour les documents téléchargeables et les représentations iconographiques et photographiques.
                </p>
                <p className="text-muted-foreground">
                  La reproduction de tout ou partie de ce site sur un support électronique quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de la publication.
                </p>
                <p className="text-muted-foreground">
                  Les marques Lendia et Lendia Group ainsi que les logos figurant sur le site sont des marques déposées.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Données personnelles</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground">
                  Conformément au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés, vous disposez d'un droit d'accès, de rectification, de suppression et d'opposition aux données personnelles vous concernant.
                </p>
                <p className="text-muted-foreground">
                  Pour exercer ces droits ou pour toute question sur le traitement de vos données, vous pouvez nous contacter :
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                  <li>Par email : dpo@lendia.fr</li>
                  <li>Par courrier : Lendia Group - DPO, 123 Avenue des Champs-Élysées, 75008 Paris</li>
                </ul>
                <p className="text-muted-foreground">
                  Pour plus d'informations, consultez notre{" "}
                  <a href="/politique-confidentialite" className="text-primary hover:underline">
                    Politique de Confidentialité
                  </a>.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Cookies</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground">
                  Ce site utilise des cookies pour améliorer votre expérience de navigation et réaliser des statistiques de visite.
                </p>
                <p className="text-muted-foreground">
                  Vous pouvez à tout moment modifier vos préférences en matière de cookies dans les paramètres de votre navigateur.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Avertissement légal sur le crédit</h2>
            <Card>
              <CardContent className="p-6">
                <p className="font-semibold text-foreground mb-4">
                  Un crédit vous engage et doit être remboursé. Vérifiez vos capacités de remboursement avant de vous engager.
                </p>
                <p className="text-muted-foreground">
                  Toute souscription de crédit est soumise à l'acceptation de votre dossier par Lendia Group. 
                  Vous disposez d'un délai de rétractation de 14 jours à compter de la signature du contrat de crédit.
                </p>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
