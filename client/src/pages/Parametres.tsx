import InfoTicker from "@/components/InfoTicker";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User, Shield, Bell, FileText, Upload } from "lucide-react";
import { useState, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUser, useUpdateUser } from "@/lib/api";

export default function Parametres() {
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const { toast } = useToast();
  const { data: user, isLoading, error } = useUser();
  const updateUserMutation = useUpdateUser();
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handleSaveProfile = async () => {
    try {
      await updateUserMutation.mutateAsync({
        fullName,
        email,
        phone,
      });
      
      toast({
        title: "Profil mis à jour",
        description: "Vos modifications ont été enregistrées avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de la mise à jour.",
        variant: "destructive",
      });
    }
  };

  const handleUploadDocument = () => {
    toast({
      title: "Document téléchargé",
      description: "Votre document a été envoyé pour vérification.",
    });
  };

  return (
    <div className="flex flex-col min-h-screen">
      <InfoTicker />
      
      <div className="flex-1 p-6 space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Paramètres</h1>
          <p className="text-muted-foreground mt-1">
            Gérez votre compte et vos préférences
          </p>
        </div>

        {error && (
          <div className="p-4 border border-destructive bg-destructive/10 rounded-lg text-destructive">
            Une erreur est survenue lors du chargement de vos paramètres.
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-2">
          <Card data-testid="card-profile-settings">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                  <User className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Informations personnelles</CardTitle>
                  <CardDescription>Mettez à jour vos informations</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-4">
                <Avatar className="h-20 w-20">
                  <AvatarFallback className="bg-primary text-primary-foreground text-2xl">
                    SM
                  </AvatarFallback>
                </Avatar>
                <Button variant="outline" size="sm" data-testid="button-change-photo">
                  Changer la photo
                </Button>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name">Nom complet</Label>
                <Input 
                  id="name" 
                  value={fullName} 
                  onChange={(e) => setFullName(e.target.value)}
                  disabled={isLoading}
                  placeholder="Votre nom complet"
                  data-testid="input-name" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email} 
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={isLoading}
                  placeholder="votre.email@exemple.fr"
                  data-testid="input-email" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="phone">Téléphone</Label>
                <Input 
                  id="phone" 
                  type="tel" 
                  value={phone} 
                  onChange={(e) => setPhone(e.target.value)}
                  disabled={isLoading}
                  placeholder="+33 6 12 34 56 78"
                  data-testid="input-phone" 
                />
              </div>

              <Button 
                className="w-full" 
                onClick={handleSaveProfile} 
                disabled={isLoading || updateUserMutation.isPending}
                data-testid="button-save-profile"
              >
                Enregistrer les modifications
              </Button>
            </CardContent>
          </Card>

          <Card data-testid="card-security-settings">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                  <Shield className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Sécurité</CardTitle>
                  <CardDescription>Protégez votre compte</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="space-y-0.5">
                  <Label htmlFor="2fa">Authentification à deux facteurs</Label>
                  <p className="text-sm text-muted-foreground">
                    Ajoutez une couche de sécurité supplémentaire
                  </p>
                </div>
                <Switch
                  id="2fa"
                  checked={twoFactorEnabled}
                  onCheckedChange={setTwoFactorEnabled}
                  data-testid="switch-2fa"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="current-password">Mot de passe actuel</Label>
                <Input id="current-password" type="password" data-testid="input-current-password" />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password">Nouveau mot de passe</Label>
                <Input id="new-password" type="password" data-testid="input-new-password" />
              </div>

              <Button className="w-full" variant="outline" data-testid="button-change-password">
                Changer le mot de passe
              </Button>
            </CardContent>
          </Card>

          <Card data-testid="card-notification-settings">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                  <Bell className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Notifications</CardTitle>
                  <CardDescription>Gérez vos préférences de notification</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="space-y-0.5">
                  <Label htmlFor="email-notif">Notifications par email</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevez des alertes par email
                  </p>
                </div>
                <Switch
                  id="email-notif"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                  data-testid="switch-email-notifications"
                />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="space-y-0.5">
                  <Label htmlFor="sms-notif">Notifications SMS</Label>
                  <p className="text-sm text-muted-foreground">
                    Recevez des alertes par SMS
                  </p>
                </div>
                <Switch id="sms-notif" data-testid="switch-sms-notifications" />
              </div>

              <div className="flex items-center justify-between p-4 rounded-lg border">
                <div className="space-y-0.5">
                  <Label htmlFor="transaction-notif">Alertes de transaction</Label>
                  <p className="text-sm text-muted-foreground">
                    Notifications pour chaque transaction
                  </p>
                </div>
                <Switch id="transaction-notif" defaultChecked data-testid="switch-transaction-notifications" />
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-documents">
            <CardHeader>
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-md bg-primary/10 flex items-center justify-center">
                  <FileText className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <CardTitle>Documents KYC</CardTitle>
                  <CardDescription>Téléchargez vos justificatifs</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover-elevate">
                <Upload className="h-10 w-10 mx-auto mb-3 text-muted-foreground" />
                <p className="text-sm font-medium mb-1">Télécharger un document</p>
                <p className="text-xs text-muted-foreground mb-3">
                  Pièce d'identité, justificatif de domicile, etc.
                </p>
                <Button variant="outline" size="sm" onClick={handleUploadDocument} data-testid="button-upload-document">
                  Choisir un fichier
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Pièce d'identité</span>
                  </div>
                  <span className="text-xs text-chart-3">Vérifié</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <FileText className="h-4 w-4 text-muted-foreground" />
                    <span className="text-sm">Justificatif de domicile</span>
                  </div>
                  <span className="text-xs text-chart-3">Vérifié</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
