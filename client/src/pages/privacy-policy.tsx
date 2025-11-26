import { Card, CardContent } from "@/components/ui/card";

export default function PrivacyPolicy() {
  return (
    <div className="py-12">
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12">
          <h1 className="text-4xl font-bold mb-4">Politique de Confidentialite</h1>
          <p className="text-muted-foreground">
            Derniere mise a jour : {new Date().toLocaleDateString('fr-FR', { year: 'numeric', month: 'long', day: 'numeric' })}
          </p>
        </div>

        <div className="space-y-8">
          <section>
            <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground">
                  Solventis Group (ci-apres "nous", "notre") accorde une grande importance 
                  a la protection de vos donnees personnelles et s'engage a les traiter de maniere transparente, 
                  securisee et conforme au Reglement General sur la Protection des Donnees (RGPD).
                </p>
                <p className="text-muted-foreground">
                  Cette politique de confidentialite vous informe sur la maniere dont nous collectons, utilisons, 
                  partageons et protegeons vos donnees personnelles lors de votre utilisation de notre site web 
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
                  Le responsable du traitement de vos donnees personnelles est :
                </p>
                <p className="text-muted-foreground">
                  Solventis Group SAS<br />
                  15 Avenue de l'Opera<br />
                  75001 Paris, France<br />
                  Email : dpo@solventis-group.fr<br />
                  Telephone : 01 44 55 66 77
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">3. Donnees collectees</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div>
                  <h3 className="font-semibold mb-2">Donnees d'identification</h3>
                  <p className="text-muted-foreground">
                    Nom, prenom, date de naissance, adresse postale, adresse email, numero de telephone
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Donnees financieres</h3>
                  <p className="text-muted-foreground">
                    Revenus, situation professionnelle, charges, historique bancaire, informations sur vos credits en cours
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Donnees de connexion</h3>
                  <p className="text-muted-foreground">
                    Adresse IP, type de navigateur, pages visitees, duree de visite, source de reference
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold mb-2">Pour les professionnels</h3>
                  <p className="text-muted-foreground">
                    Raison sociale, SIRET, chiffre d'affaires, secteur d'activite, forme juridique
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">4. Finalites du traitement</h2>
            <Card>
              <CardContent className="p-6">
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">-</span>
                    <span><strong>Traitement des demandes de credit :</strong> Analyse de votre solvabilite et traitement de votre dossier de financement</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">-</span>
                    <span><strong>Gestion de la relation client :</strong> Communication, service client, suivi de votre dossier</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">-</span>
                    <span><strong>Conformite reglementaire :</strong> Respect des obligations legales (KYC, lutte contre le blanchiment, FICP)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">-</span>
                    <span><strong>Amelioration de nos services :</strong> Statistiques, analyses, optimisation de notre plateforme</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">-</span>
                    <span><strong>Marketing :</strong> Avec votre consentement, envoi d'offres commerciales personnalisees</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">-</span>
                    <span><strong>Securite :</strong> Prevention de la fraude et protection de votre compte</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">5. Base legale du traitement</h2>
            <Card>
              <CardContent className="p-6">
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">-</span>
                    <span><strong>Execution du contrat :</strong> Traitement necessaire a la fourniture de nos services de credit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">-</span>
                    <span><strong>Obligation legale :</strong> Conformite aux obligations reglementaires (ACPR, TRACFIN)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">-</span>
                    <span><strong>Interet legitime :</strong> Amelioration de nos services, securite, prevention de la fraude</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">-</span>
                    <span><strong>Consentement :</strong> Marketing direct, cookies non essentiels</span>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">6. Destinataires des donnees</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground">Vos donnees peuvent etre partagees avec :</p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>- Nos prestataires de services (hebergement, paiement, verification d'identite)</li>
                  <li>- Les organismes de credit et bureaux de credit (Banque de France - FICP, Equifax)</li>
                  <li>- Les autorites de controle (ACPR, TRACFIN) dans le cadre de nos obligations legales</li>
                  <li>- Nos partenaires bancaires et etablissements de credit</li>
                  <li>- Les autorites judiciaires en cas de requisition legale</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  Tous nos prestataires sont soumis a des obligations strictes de confidentialite et de securite.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">7. Duree de conservation</h2>
            <Card>
              <CardContent className="p-6">
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">-</span>
                    <span><strong>Donnees de prospect :</strong> 3 ans a compter du dernier contact</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">-</span>
                    <span><strong>Donnees de client :</strong> 5 ans apres la fin du contrat de credit</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">-</span>
                    <span><strong>Pieces justificatives :</strong> 5 ans (obligation legale)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">-</span>
                    <span><strong>Donnees comptables :</strong> 10 ans (obligation legale)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">-</span>
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
                <p className="text-muted-foreground">Conformement au RGPD, vous disposez des droits suivants :</p>
                <ul className="space-y-3 text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">-</span>
                    <span><strong>Droit d'acces :</strong> Obtenir une copie de vos donnees personnelles</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">-</span>
                    <span><strong>Droit de rectification :</strong> Corriger des donnees inexactes ou incompletes</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">-</span>
                    <span><strong>Droit a l'effacement :</strong> Demander la suppression de vos donnees (sous conditions)</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">-</span>
                    <span><strong>Droit de limitation :</strong> Limiter le traitement de vos donnees</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">-</span>
                    <span><strong>Droit a la portabilite :</strong> Recuperer vos donnees dans un format structure</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">-</span>
                    <span><strong>Droit d'opposition :</strong> Vous opposer au traitement de vos donnees a des fins de prospection</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-primary mt-1">-</span>
                    <span><strong>Droit de retirer votre consentement :</strong> A tout moment pour les traitements bases sur le consentement</span>
                  </li>
                </ul>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-muted-foreground mb-2">Pour exercer vos droits, contactez-nous :</p>
                  <ul className="space-y-1 text-muted-foreground">
                    <li>- Par email : dpo@solventis-group.fr</li>
                    <li>- Par courrier : Solventis Group - DPO, 15 Avenue de l'Opera, 75001 Paris</li>
                  </ul>
                  <p className="text-muted-foreground mt-3">
                    Nous nous engageons a repondre a votre demande dans un delai d'un mois maximum.
                  </p>
                </div>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">9. Securite des donnees</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground">
                  Nous mettons en oeuvre des mesures techniques et organisationnelles appropriees pour proteger vos donnees personnelles contre :
                </p>
                <ul className="space-y-2 text-muted-foreground">
                  <li>- La perte accidentelle ou illicite</li>
                  <li>- L'acces non autorise</li>
                  <li>- La divulgation non autorisee</li>
                  <li>- La modification</li>
                  <li>- La destruction</li>
                </ul>
                <p className="text-muted-foreground mt-4">
                  Nos mesures de securite incluent le chiffrement SSL/TLS, l'authentification forte, 
                  la limitation des acces, la sauvegarde reguliere des donnees et la formation de nos equipes.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">10. Cookies</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground">
                  Notre site utilise des cookies pour ameliorer votre experience et analyser l'utilisation du site.
                </p>
                <div>
                  <h3 className="font-semibold mb-2">Types de cookies utilises :</h3>
                  <ul className="space-y-2 text-muted-foreground">
                    <li>- <strong>Cookies essentiels :</strong> Necessaires au fonctionnement du site (authentification, securite)</li>
                    <li>- <strong>Cookies de performance :</strong> Analyse du trafic et amelioration de nos services</li>
                    <li>- <strong>Cookies de marketing :</strong> Personnalisation des publicites (avec votre consentement)</li>
                  </ul>
                </div>
                <p className="text-muted-foreground">
                  Vous pouvez a tout moment modifier vos preferences en matiere de cookies dans les parametres de votre navigateur.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">11. Transferts internationaux</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground">
                  Vos donnees sont principalement traitees au sein de l'Union Europeenne. 
                  Si un transfert hors UE est necessaire, nous nous assurons que des garanties appropriees sont en place 
                  (clauses contractuelles types de la Commission europeenne, decision d'adequation).
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">12. Reclamation</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <p className="text-muted-foreground">
                  Si vous estimez que le traitement de vos donnees personnelles porte atteinte a vos droits, 
                  vous avez le droit d'introduire une reclamation aupres de la CNIL :
                </p>
                <p className="text-muted-foreground">
                  Commission Nationale de l'Informatique et des Libertes (CNIL)<br />
                  3 Place de Fontenoy<br />
                  TSA 80715<br />
                  75334 Paris Cedex 07<br />
                  Telephone : 01 53 73 22 22<br />
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
                  Nous nous reservons le droit de modifier cette politique de confidentialite a tout moment. 
                  Toute modification sera publiee sur cette page avec une date de mise a jour. 
                  Nous vous encourageons a consulter regulierement cette page pour prendre connaissance des eventuelles modifications.
                </p>
              </CardContent>
            </Card>
          </section>

          <section>
            <h2 className="text-2xl font-bold mb-4">14. Contact</h2>
            <Card>
              <CardContent className="p-6">
                <p className="text-muted-foreground mb-4">
                  Pour toute question concernant cette politique de confidentialite ou le traitement de vos donnees personnelles :
                </p>
                <p className="text-muted-foreground">
                  <strong>Delegue a la Protection des Donnees (DPO)</strong><br />
                  Solventis Group<br />
                  Email : dpo@solventis-group.fr<br />
                  Adresse : 15 Avenue de l'Opera, 75001 Paris, France<br />
                  Telephone : 01 44 55 66 77
                </p>
              </CardContent>
            </Card>
          </section>
        </div>
      </div>
    </div>
  );
}
