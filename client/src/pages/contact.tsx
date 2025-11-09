import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Mail, Phone, MapPin, Clock } from "lucide-react";
import { useTranslation } from 'react-i18next';

export default function Contact() {
  const { t } = useTranslation();

  return (
    <div className="py-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-12 text-center">
          <h1 className="text-4xl font-bold mb-4">{t('contact.title')}</h1>
          <p className="text-xl text-muted-foreground">
            {t('contact.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>{t('contact.sendMessage')}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">{t('contact.fullName')}</Label>
                    <Input id="name" placeholder={t('contact.fullNamePlaceholder')} data-testid="input-name" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">{t('contact.email')}</Label>
                    <Input id="email" type="email" placeholder={t('contact.emailPlaceholder')} data-testid="input-email" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="phone">{t('contact.phone')}</Label>
                  <Input id="phone" type="tel" placeholder={t('contact.phonePlaceholder')} data-testid="input-phone" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subject">{t('contact.subject')}</Label>
                  <Input id="subject" placeholder={t('contact.subjectPlaceholder')} data-testid="input-subject" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">{t('contact.message')}</Label>
                  <Textarea
                    id="message"
                    placeholder={t('contact.messagePlaceholder')}
                    rows={6}
                    data-testid="textarea-message"
                  />
                </div>
                <Button className="w-full" data-testid="button-send">
                  {t('contact.send')}
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="space-y-6">
            <Card>
              <CardContent className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Phone className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">{t('contact.phoneLabel')}</div>
                    <div className="text-muted-foreground">{t('contact.phoneValue')}</div>
                    <div className="text-sm text-muted-foreground">{t('contact.schedule')}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">{t('contact.emailLabel')}</div>
                    <div className="text-muted-foreground">{t('contact.emailValue')}</div>
                    <div className="text-sm text-muted-foreground">{t('contact.responseTime')}</div>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <MapPin className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">{t('contact.address')}</div>
                    <div className="text-muted-foreground" dangerouslySetInnerHTML={{ __html: t('contact.addressValue') }} />
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                    <Clock className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-semibold">{t('contact.hours')}</div>
                    <div className="text-sm text-muted-foreground" dangerouslySetInnerHTML={{ __html: t('contact.hoursValue') }} />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
