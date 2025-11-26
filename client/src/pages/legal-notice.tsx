import { Card, CardContent } from "@/components/ui/card";

export default function LegalNotice() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Mentions Legales</h1>
          <p className="text-muted-foreground">
            Derniere mise a jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Informations legales</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Raison sociale</h3>
                  <p className="text-muted-foreground">Solventis Group SAS</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Siege social</h3>
                  <p className="text-muted-foreground">
                    15 Avenue de l'Opera<br />
                    75001 Paris, France
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Forme juridique</h3>
                  <p className="text-muted-foreground">Societe par Actions Simplifiee (SAS)</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Capital social</h3>
                  <p className="text-muted-foreground">1 000 000 EUR</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">SIREN / SIRET</h3>
                  <p className="text-muted-foreground">912 345 678 00015</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">RCS</h3>
                  <p className="text-muted-foreground">Paris B 912 345 678</p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Numero de TVA intracommunautaire</h3>
                  <p className="text-muted-foreground">FR 91 912345678</p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Activite reglementee</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Agrement</h3>
                  <p className="text-muted-foreground">
                    Solventis Group est un etablissement de credit agree par l'Autorite de Controle Prudentiel et de Resolution (ACPR).
                  </p>
                  <p className="text-muted-foreground mt-2">
                    Numero d'agrement ACPR : 23456
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Autorite de controle</h3>
                  <p className="text-muted-foreground">
                    Autorite de Controle Prudentiel et de Resolution (ACPR)<br />
                    4 Place de Budapest<br />
                    CS 92459<br />
                    75436 Paris Cedex 09<br />
                    <a href="https://acpr.banque-france.fr" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                      https://acpr.banque-france.fr
                    </a>
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Mediateur de la consommation</h3>
                  <p className="text-muted-foreground">
                    En cas de litige, vous pouvez recourir gratuitement au mediateur de la consommation :<br />
                    Mediateur de l'AMF<br />
                    Autorite des Marches Financiers<br />
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
                  Le directeur de la publication du site est M. Alexandre Martin, President de la SAS Solventis Group.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Hebergement</h2>
            <Card>
              <CardContent className="p-6 space-y-2">
                <p className="text-muted-foreground">
                  Le site www.solventis-group.fr est heberge par :
                </p>
                <p className="text-muted-foreground">
                  Replit, Inc.<br />
                  548 Market St PMB 62930<br />
                  San Francisco, CA 94104<br />
                  Etats-Unis
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Propriete intellectuelle</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground">
                  L'ensemble de ce site releve de la legislation francaise et internationale sur le droit d'auteur et la propriete intellectuelle. 
                  Tous les droits de reproduction sont reserves.
                </p>
                <p className="text-muted-foreground">
                  La reproduction de tout ou partie de ce site sur un support electronique quel qu'il soit est formellement interdite sauf autorisation expresse du directeur de la publication.
                </p>
                <p className="text-muted-foreground">
                  Les marques Solventis et Solventis Group ainsi que les logos figurant sur le site sont des marques deposees.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Donnees personnelles</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground">
                  Conformement au Reglement General sur la Protection des Donnees (RGPD), vous disposez d'un droit d'acces, de rectification, de suppression et d'opposition aux donnees personnelles vous concernant.
                </p>
                <p className="text-muted-foreground">
                  Pour exercer ces droits ou pour toute question sur le traitement de vos donnees, vous pouvez nous contacter :
                </p>
                <ul className="list-disc pl-6 text-muted-foreground space-y-1">
                  <li>Par email : dpo@solventis-group.fr</li>
                  <li>Par courrier : Solventis Group - DPO, 15 Avenue de l'Opera, 75001 Paris</li>
                </ul>
                <p className="text-muted-foreground">
                  Pour plus d'informations, consultez notre{" "}
                  <a href="/politique-confidentialite" className="text-primary hover:underline">
                    Politique de Confidentialite
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
                  Ce site utilise des cookies pour ameliorer votre experience de navigation et realiser des statistiques de visite.
                </p>
                <p className="text-muted-foreground">
                  Vous pouvez a tout moment modifier vos preferences en matiere de cookies dans les parametres de votre navigateur.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Avertissement legal sur le credit</h2>
            <Card>
              <CardContent className="p-6">
                <p className="font-semibold text-foreground mb-4">
                  Un credit vous engage et doit etre rembourse. Verifiez vos capacites de remboursement avant de vous engager.
                </p>
                <p className="text-muted-foreground">
                  Toute souscription de credit est soumise a l'acceptation de votre dossier par Solventis Group. 
                  Vous disposez d'un delai de retractation de 14 jours a compter de la signature du contrat de credit.
                </p>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
