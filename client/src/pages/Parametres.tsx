import InfoTicker from "@/components/InfoTicker";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { User, Shield, Bell, FileText, Upload } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useToast } from "@/hooks/use-toast";
import { useUser, useUpdateUser, useChangePassword } from "@/lib/api";
import { queryClient } from "@/lib/queryClient";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

export default function Parametres() {
  const [emailNotifications, setEmailNotifications] = useState(true);
  const { toast } = useToast();
  const { data: user, isLoading, error } = useUser();
  const updateUserMutation = useUpdateUser();
  const changePasswordMutation = useChangePassword();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [uploadingPicture, setUploadingPicture] = useState(false);
  
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [show2FADialog, setShow2FADialog] = useState(false);
  const [twoFactorMode, setTwoFactorMode] = useState<'enable' | 'disable'>('enable');
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [twoFactorSecret, setTwoFactorSecret] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [processing2FA, setProcessing2FA] = useState(false);

  useEffect(() => {
    if (user) {
      setFullName(user.fullName || '');
      setEmail(user.email || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  const handle2FAToggle = async (checked: boolean) => {
    if (checked) {
      try {
        const response = await fetch('/api/2fa/setup', {
          method: 'POST',
          credentials: 'include',
        });

        if (!response.ok) {
          throw new Error(await response.text());
        }

        const data = await response.json();
        setQrCodeUrl(data.qrCode);
        setTwoFactorSecret(data.secret);
        setTwoFactorMode('enable');
        setShow2FADialog(true);
      } catch (error) {
        toast({
          title: "Erreur",
          description: "Impossible de générer le code QR",
          variant: "destructive",
        });
      }
    } else {
      setTwoFactorMode('disable');
      setShow2FADialog(true);
    }
  };

  const handle2FASubmit = async () => {
    if (verificationCode.length !== 6) {
      toast({
        title: "Erreur",
        description: "Le code doit contenir 6 chiffres",
        variant: "destructive",
      });
      return;
    }

    setProcessing2FA(true);
    try {
      const endpoint = twoFactorMode === 'enable' ? '/api/2fa/enable' : '/api/2fa/disable';
      const body = twoFactorMode === 'enable' 
        ? { token: verificationCode, secret: twoFactorSecret }
        : { token: verificationCode };

      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(body),
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.error);
      }

      await queryClient.invalidateQueries({ queryKey: ['user'] });
      
      toast({
        title: "Succès",
        description: twoFactorMode === 'enable' 
          ? "2FA activé avec succès" 
          : "2FA désactivé avec succès",
      });

      setShow2FADialog(false);
      setVerificationCode('');
      setQrCodeUrl('');
      setTwoFactorSecret('');
    } catch (error: any) {
      toast({
        title: "Erreur",
        description: error.message || "Code invalide",
        variant: "destructive",
      });
    } finally {
      setProcessing2FA(false);
    }
  };

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

  const handleProfilePictureClick = () => {
    fileInputRef.current?.click();
  };

  const handleProfilePictureChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.type.match(/^image\/(jpeg|jpg|png|webp)$/)) {
      toast({
        title: "Erreur",
        description: "Seules les images JPEG, PNG et WEBP sont autorisées",
        variant: "destructive",
      });
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Erreur",
        description: "La taille maximale du fichier est de 5 Mo",
        variant: "destructive",
      });
      return;
    }

    setUploadingPicture(true);
    const formData = new FormData();
    formData.append('profilePicture', file);

    try {
      const response = await fetch('/api/user/profile-picture', {
        method: 'POST',
        body: formData,
        credentials: 'include',
      });

      if (!response.ok) {
        throw new Error(await response.text());
      }

      const data = await response.json();
      await queryClient.invalidateQueries({ queryKey: ['user'] });
      
      toast({
        title: "Photo mise à jour",
        description: "Votre photo de profil a été modifiée avec succès.",
      });
    } catch (error) {
      toast({
        title: "Erreur",
        description: "Une erreur est survenue lors de l'upload de la photo.",
        variant: "destructive",
      });
    } finally {
      setUploadingPicture(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      <InfoTicker />
      
      <div className="flex-1 p-4 sm:p-5 md:p-6 space-y-4 sm:space-y-5 md:space-y-6">
        <div className="space-y-1">
          <h1 className="text-2xl sm:text-3xl font-bold">Paramètres</h1>
          <p className="text-sm sm:text-base text-muted-foreground">
            Gérez votre compte et vos préférences
          </p>
        </div>

        {error && (
          <div className="p-3 sm:p-4 border border-destructive bg-destructive/10 rounded-lg text-destructive text-sm">
            Une erreur est survenue lors du chargement de vos paramètres.
          </div>
        )}

        <div className="grid gap-4 sm:gap-5 md:gap-6 grid-cols-1 xl:grid-cols-2">
          <Card data-testid="card-profile-settings">
            <CardHeader>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <User className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base sm:text-lg">Informations personnelles</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Mettez à jour vos informations</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="flex items-center gap-3 sm:gap-4">
                <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                  {user?.profilePicture && (
                    <AvatarImage src={user.profilePicture} alt={user.fullName} />
                  )}
                  <AvatarFallback className="bg-primary text-primary-foreground text-xl sm:text-2xl">
                    {user?.fullName?.split(' ').map(n => n[0]).join('').toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col gap-2">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/jpeg,image/jpg,image/png,image/webp"
                    onChange={handleProfilePictureChange}
                    className="hidden"
                    data-testid="input-profile-picture"
                  />
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={handleProfilePictureClick}
                    disabled={uploadingPicture}
                    data-testid="button-change-photo"
                  >
                    {uploadingPicture ? "Chargement..." : "Changer la photo"}
                  </Button>
                  {user?.profilePicture && (
                    <p className="text-xs text-muted-foreground">
                      Taille max : 5 Mo
                    </p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm">Nom complet</Label>
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
                <Label htmlFor="email" className="text-sm">Email</Label>
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
                <Label htmlFor="phone" className="text-sm">Téléphone</Label>
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
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Shield className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base sm:text-lg">Sécurité</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Protégez votre compte</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg border gap-3">
                <div className="space-y-0.5 flex-1 min-w-0">
                  <Label htmlFor="2fa" className="text-sm">Authentification à deux facteurs</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    {user?.twoFactorEnabled ? "Activée" : "Ajoutez une couche de sécurité supplémentaire"}
                  </p>
                </div>
                <Switch
                  id="2fa"
                  checked={user?.twoFactorEnabled || false}
                  onCheckedChange={handle2FAToggle}
                  data-testid="switch-2fa"
                  className="flex-shrink-0"
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="current-password" className="text-sm">Mot de passe actuel</Label>
                <Input 
                  id="current-password" 
                  type="password" 
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                  data-testid="input-current-password" 
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="new-password" className="text-sm">Nouveau mot de passe</Label>
                <Input 
                  id="new-password" 
                  type="password" 
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  data-testid="input-new-password" 
                />
              </div>

              <Button 
                className="w-full" 
                variant="outline" 
                onClick={async () => {
                  try {
                    await changePasswordMutation.mutateAsync({ currentPassword, newPassword });
                    toast({
                      title: "Mot de passe modifié",
                      description: "Votre mot de passe a été modifié avec succès. Vous allez être déconnecté.",
                    });
                    setCurrentPassword('');
                    setNewPassword('');
                    setTimeout(() => {
                      window.location.href = '/auth/connexion';
                    }, 2000);
                  } catch (error: any) {
                    toast({
                      title: "Erreur",
                      description: error.message || "Une erreur est survenue lors du changement de mot de passe.",
                      variant: "destructive",
                    });
                  }
                }}
                disabled={!currentPassword || !newPassword || changePasswordMutation.isPending}
                data-testid="button-change-password"
              >
                Changer le mot de passe
              </Button>
            </CardContent>
          </Card>

          <Card data-testid="card-notification-settings">
            <CardHeader>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base sm:text-lg">Notifications</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Gérez vos préférences de notification</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg border gap-3">
                <div className="space-y-0.5 flex-1 min-w-0">
                  <Label htmlFor="email-notif" className="text-sm">Notifications par email</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Recevez des alertes par email
                  </p>
                </div>
                <Switch
                  id="email-notif"
                  checked={emailNotifications}
                  onCheckedChange={setEmailNotifications}
                  data-testid="switch-email-notifications"
                  className="flex-shrink-0"
                />
              </div>

              <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg border gap-3">
                <div className="space-y-0.5 flex-1 min-w-0">
                  <Label htmlFor="sms-notif" className="text-sm">Notifications SMS</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Recevez des alertes par SMS
                  </p>
                </div>
                <Switch id="sms-notif" data-testid="switch-sms-notifications" className="flex-shrink-0" />
              </div>

              <div className="flex items-center justify-between p-3 sm:p-4 rounded-lg border gap-3">
                <div className="space-y-0.5 flex-1 min-w-0">
                  <Label htmlFor="transaction-notif" className="text-sm">Alertes de transaction</Label>
                  <p className="text-xs sm:text-sm text-muted-foreground">
                    Notifications pour chaque transaction
                  </p>
                </div>
                <Switch id="transaction-notif" defaultChecked data-testid="switch-transaction-notifications" className="flex-shrink-0" />
              </div>
            </CardContent>
          </Card>

          <Card data-testid="card-documents">
            <CardHeader>
              <div className="flex items-center gap-2 sm:gap-3">
                <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-md bg-primary/10 flex items-center justify-center flex-shrink-0">
                  <FileText className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
                </div>
                <div>
                  <CardTitle className="text-base sm:text-lg">Documents KYC</CardTitle>
                  <CardDescription className="text-xs sm:text-sm">Téléchargez vos justificatifs</CardDescription>
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 sm:space-y-4">
              <div className="border-2 border-dashed rounded-lg p-4 sm:p-6 text-center hover-elevate">
                <Upload className="h-8 w-8 sm:h-10 sm:w-10 mx-auto mb-2 sm:mb-3 text-muted-foreground" />
                <p className="text-xs sm:text-sm font-medium mb-1">Télécharger un document</p>
                <p className="text-xs text-muted-foreground mb-2 sm:mb-3">
                  Pièce d'identité, justificatif de domicile, etc.
                </p>
                <Button variant="outline" size="sm" onClick={handleUploadDocument} data-testid="button-upload-document">
                  Choisir un fichier
                </Button>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Pièce d'identité</span>
                  </div>
                  <span className="text-xs text-chart-3">Vérifié</span>
                </div>
                <div className="flex items-center justify-between p-3 rounded-lg bg-muted/50">
                  <div className="flex items-center gap-2">
                    <FileText className="h-3 w-3 sm:h-4 sm:w-4 text-muted-foreground flex-shrink-0" />
                    <span className="text-xs sm:text-sm">Justificatif de domicile</span>
                  </div>
                  <span className="text-xs text-chart-3">Vérifié</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={show2FADialog} onOpenChange={setShow2FADialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>
              {twoFactorMode === 'enable' ? 'Activer 2FA' : 'Désactiver 2FA'}
            </DialogTitle>
            <DialogDescription>
              {twoFactorMode === 'enable' 
                ? 'Scannez le code QR avec votre application d\'authentification (Google Authenticator, Authy, etc.) puis entrez le code généré.'
                : 'Entrez le code de votre application d\'authentification pour désactiver la 2FA.'
              }
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {twoFactorMode === 'enable' && qrCodeUrl && (
              <div className="flex flex-col items-center gap-4">
                <img src={qrCodeUrl} alt="QR Code" className="w-48 h-48" />
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">Secret manuel :</p>
                  <code className="text-xs bg-muted px-2 py-1 rounded">{twoFactorSecret}</code>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="verification-code">Code de vérification</Label>
              <div className="flex justify-center">
                <InputOTP
                  maxLength={6}
                  value={verificationCode}
                  onChange={setVerificationCode}
                  data-testid="input-2fa-code"
                >
                  <InputOTPGroup>
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </div>
            </div>
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-row">
            <Button
              variant="outline"
              onClick={() => {
                setShow2FADialog(false);
                setVerificationCode('');
                setQrCodeUrl('');
                setTwoFactorSecret('');
              }}
              disabled={processing2FA}
              data-testid="button-cancel-2fa"
            >
              Annuler
            </Button>
            <Button
              onClick={handle2FASubmit}
              disabled={verificationCode.length !== 6 || processing2FA}
              data-testid="button-confirm-2fa"
            >
              {processing2FA ? 'Vérification...' : 'Confirmer'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
