import { Card, CardContent } from "@/components/ui/card";
import { Shield, Users, Award, TrendingUp, Building, MapPin, Mail } from "lucide-react";
import { useTranslation } from 'react-i18next';

export default function About() {
  const { t } = useTranslation();

  const stats = [
    {
      titleKey: "about.security",
      descriptionKey: "about.securityDesc",
      icon: Shield,
    },
    {
      titleKey: "about.clients",
      descriptionKey: "about.clientsDesc",
      icon: Users,
    },
    {
      titleKey: "about.expertise",
      descriptionKey: "about.expertiseDesc",
      icon: Award,
    },
    {
      titleKey: "about.innovation",
      descriptionKey: "about.innovationDesc",
      icon: TrendingUp,
    },
  ];

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">{t('about.title')}</h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
            {t('about.subtitle')}
          </p>
        </div>

        <div className="prose max-w-none mb-12">
          <p className="text-lg text-muted-foreground">
            {t('about.intro1')}
          </p>
          <p className="text-lg text-muted-foreground mt-4">
            {t('about.intro2')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardContent className="p-6 text-center space-y-4">
                <div className="mx-auto h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
                  <stat.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold">{t(stat.titleKey)}</h3>
                <p className="text-muted-foreground">{t(stat.descriptionKey)}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="space-y-12">
          <div>
            <h2 className="text-2xl font-bold mb-4">{t('about.commitment')}</h2>
            <p className="text-muted-foreground">
              {t('about.commitmentText')}
            </p>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">{t('about.values')}</h2>
            <ul className="space-y-2 text-muted-foreground">
              <li>• <strong>{t('about.transparency')}</strong> : {t('about.transparencyDesc')}</li>
              <li>• <strong>{t('about.speed')}</strong> : {t('about.speedDesc')}</li>
              <li>• <strong>{t('about.support')}</strong> : {t('about.supportDesc')}</li>
              <li>• <strong>{t('about.flexibility')}</strong> : {t('about.flexibilityDesc')}</li>
              <li>• <strong>{t('about.innovationValue')}</strong> : {t('about.innovationValueDesc')}</li>
            </ul>
          </div>

          <div>
            <h2 className="text-2xl font-bold mb-4">{t('about.legalInfo')}</h2>
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="flex items-start gap-3">
                    <Building className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold mb-1">{t('about.companyName')}</div>
                      <div className="text-sm text-muted-foreground">
                        {t('about.companyNameValue')}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-3">
                    <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold mb-1">{t('about.headquarters')}</div>
                      <div className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: t('about.headquartersValue') }} />
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Building className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold mb-1">{t('about.siret')}</div>
                      <div className="text-sm text-muted-foreground">
                        {t('about.siretValue')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Award className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold mb-1">{t('about.capital')}</div>
                      <div className="text-sm text-muted-foreground">
                        {t('about.capitalValue')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold mb-1">{t('about.accreditation')}</div>
                      <div className="text-sm text-muted-foreground">
                        {t('about.accreditationValue')}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="h-5 w-5 text-primary flex-shrink-0 mt-1" />
                    <div>
                      <div className="font-semibold mb-1">{t('about.contact')}</div>
                      <div className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: t('about.contactValue') }} />
                    </div>
                  </div>
                </div>
                
                <div className="pt-4 border-t">
                  <p className="text-xs text-muted-foreground">
                    {t('about.legalDisclaimer')}
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
