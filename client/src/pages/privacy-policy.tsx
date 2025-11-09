import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Politique de Confidentialité</h1>
          <p className="text-muted-foreground">
            Dernière mise à jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground">
                  Altus Finance Group (ci-après « Altus Finance », « nous », « notre ») accorde une grande importance 
                  à la protection de vos données personnelles et s'engage à les traiter de manière transparente, 
                  sécurisée et conforme au Règlement Général sur la Protection des Données (RGPD) et à la loi Informatique et Libertés.
                </p>
                <p className="text-muted-foreground">
                  Cette politique de confidentialité vous informe sur la manière dont nous collectons, utilisons, 
                  partageons et protégeons vos données personnelles lors de votre utilisation de notre site web 
                  et de nos services de financement.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">2. Responsable du traitement</h2>
            <Card>
              <CardContent className="p-6 space-y-2">
                <p className="text-muted-foreground">
                  Le responsable du traitement de vos données personnelles est :
                </p>
                <p className="text-muted-foreground">
                  Altus Finance Group SAS<br />
                  123 Avenue des Champs-Élysées<br />
                  75008 Paris, France<br />
                  Email : dpo@altusfinance.fr<br />
                  Téléphone : 01 23 45 67 89
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Données collectées</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Données d'identification</h3>
                  <p className="text-muted-foreground">
                    Nom, prénom, date de naissance, adresse postale, adresse email, numéro de téléphone
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Données financières</h3>
                  <p className="text-muted-foreground">
                    Revenus, situation professionnelle, charges, historique bancaire, informations sur vos crédits en cours
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Données de connexion</h3>
                  <p className="text-muted-foreground">
                    Adresse IP, type de navigateur, pages visitées, durée de visite, source de référence
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Pour les professionnels</h3>
                  <p className="text-muted-foreground">
                    Raison sociale, SIRET, chiffre d'affaires, secteur d'activité, forme juridique
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Finalités du traitement</h2>
            <Card>
              <CardContent className="p-6">
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Traitement des demandes de crédit :</strong> Analyse de votre solvabilité et traitement de votre dossier de financement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Gestion de la relation client :</strong> Communication, service client, suivi de votre dossier</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Conformité réglementaire :</strong> Respect des obligations légales (KYC, lutte contre le blanchiment, FICP)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Amélioration de nos services :</strong> Statistiques, analyses, optimisation de notre plateforme</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Marketing :</strong> Avec votre consentement, envoi d'offres commerciales personnalisées</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Sécurité :</strong> Prévention de la fraude et protection de votre compte</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Base légale du traitement</h2>
            <Card>
              <CardContent className="p-6">
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Exécution du contrat :</strong> Traitement nécessaire à la fourniture de nos services de crédit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Obligation légale :</strong> Conformité aux obligations réglementaires (ACPR, TRACFIN)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Intérêt légitime :</strong> Amélioration de nos services, sécurité, prévention de la fraude</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Consentement :</strong> Marketing direct, cookies non essentiels</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Destinataires des données</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground">Vos données peuvent être partagées avec :</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• Nos prestataires de services (hébergement, paiement, vérification d'identité)</li>
                  <li>• Les organismes de crédit et bureaux de crédit (Banque de France - FICP, Equifax)</li>
                  <li>• Les autorités de contrôle (ACPR, TRACFIN) dans le cadre de nos obligations légales</li>
                  <li>• Nos partenaires bancaires et établissements de crédit</li>
                  <li>• Les autorités judiciaires en cas de réquisition légale</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  Tous nos prestataires sont soumis à des obligations strictes de confidentialité et de sécurité.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Durée de conservation</h2>
            <Card>
              <CardContent className="p-6">
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Données de prospect :</strong> 3 ans à compter du dernier contact</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Données de client :</strong> 5 ans après la fin du contrat de crédit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Pièces justificatives :</strong> 5 ans (obligation légale)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Données comptables :</strong> 10 ans (obligation légale)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Cookies :</strong> 13 mois maximum</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">8. Vos droits</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground">Conformément au RGPD, vous disposez des droits suivants :</p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Droit d'accès :</strong> Obtenir une copie de vos données personnelles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Droit de rectification :</strong> Corriger des données inexactes ou incomplètes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Droit à l'effacement :</strong> Demander la suppression de vos données (sous conditions)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Droit de limitation :</strong> Limiter le traitement de vos données</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Droit à la portabilité :</strong> Récupérer vos données dans un format structuré</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Droit d'opposition :</strong> Vous opposer au traitement de vos données à des fins de prospection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">•</span>
                    <span><strong>Droit de retirer votre consentement :</strong> À tout moment pour les traitements basés sur le consentement</span>
                  </li>
                </ul>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-muted-foreground mb-2">Pour exercer vos droits, contactez-nous :</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>• Par email : dpo@altusfinance.fr</li>
                    <li>• Par courrier : Altus Finance Group - DPO, 123 Avenue des Champs-Élysées, 75008 Paris</li>
                  </ul>
                  <p className="text-muted-foreground mt-3">
                    Nous nous engageons à répondre à votre demande dans un délai d'un mois maximum.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. Sécurité des données</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground">
                  Nous mettons en œuvre des mesures techniques et organisationnelles appropriées pour protéger vos données personnelles contre :
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>• La perte accidentelle ou illicite</li>
                  <li>• L'accès non autorisé</li>
                  <li>• La divulgation non autorisée</li>
                  <li>• La modification</li>
                  <li>• La destruction</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  Nos mesures de sécurité incluent le chiffrement SSL/TLS, l'authentification forte, 
                  la limitation des accès, la sauvegarde régulière des données et la formation de nos équipes.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Cookies</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground">
                  Notre site utilise des cookies pour améliorer votre expérience et analyser l'utilisation du site.
                </p>
                <div>
                  <h3 className="font-semibold mb-2">Types de cookies utilisés :</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>• <strong>Cookies essentiels :</strong> Nécessaires au fonctionnement du site (authentification, sécurité)</li>
                    <li>• <strong>Cookies de performance :</strong> Analyse du trafic et amélioration de nos services</li>
                    <li>• <strong>Cookies de marketing :</strong> Personnalisation des publicités (avec votre consentement)</li>
                  </ul>
                </div>
                <p className="text-muted-foreground">
                  Vous pouvez à tout moment modifier vos préférences en matière de cookies dans les paramètres de votre navigateur.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">11. Transferts internationaux</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">
                  Vos données sont principalement traitées au sein de l'Union Européenne. 
                  Si un transfert hors UE est nécessaire, nous nous assurons que des garanties appropriées sont en place 
                  (clauses contractuelles types de la Commission européenne, décision d'adéquation).
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">12. Réclamation</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground">
                  Si vous estimez que le traitement de vos données personnelles porte atteinte à vos droits, 
                  vous avez le droit d'introduire une réclamation auprès de la CNIL :
                </p>
                <p className="text-muted-foreground">
                  Commission Nationale de l'Informatique et des Libertés (CNIL)<br />
                  3 Place de Fontenoy<br />
                  TSA 80715<br />
                  75334 Paris Cedex 07<br />
                  Téléphone : 01 53 73 22 22<br />
                  Site web :{" "}
                  <a href="https://www.cnil.fr" className="text-primary hover:underline" target="_blank" rel="noopener noreferrer">
                    www.cnil.fr
                  </a>
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">13. Modifications</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">
                  Nous nous réservons le droit de modifier cette politique de confidentialité à tout moment. 
                  Toute modification sera publiée sur cette page avec une date de mise à jour. 
                  Nous vous encourageons à consulter régulièrement cette page pour prendre connaissance des éventuelles modifications.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">14. Contact</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4">
                  Pour toute question concernant cette politique de confidentialité ou le traitement de vos données personnelles :
                </p>
                <p className="text-muted-foreground">
                  <strong>Délégué à la Protection des Données (DPO)</strong><br />
                  Altus Finance Group<br />
                  Email : dpo@altusfinance.fr<br />
                  Adresse : 123 Avenue des Champs-Élysées, 75008 Paris, France<br />
                  Téléphone : 01 23 45 67 89
                </p>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
