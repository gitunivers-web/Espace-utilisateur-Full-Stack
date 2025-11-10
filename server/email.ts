import { Resend } from "resend";

const resend = process.env.RESEND_API_KEY 
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

export interface SendPasswordResetEmailParams {
  to: string;
  resetLink: string;
  userName: string;
}

export interface SendVerificationEmailParams {
  to: string;
  verificationLink: string;
  userName: string;
}

export async function sendPasswordResetEmail({ to, resetLink, userName }: SendPasswordResetEmailParams) {
  if (!resend) {
    console.warn("Resend API key not configured. Email sending is disabled.");
    console.log(`Password reset link for ${to} (${userName}): ${resetLink}`);
    return null;
  }
  
  try {
    const { data, error } = await resend.emails.send({
      from: "Lendia <onboarding@resend.dev>",
      to: [to],
      subject: "Réinitialisation de votre mot de passe - Lendia",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; padding: 12px 30px; background: #7c3aed; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">Lendia</h1>
              </div>
              <div class="content">
                <h2>Bonjour ${userName},</h2>
                <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
                <p>Cliquez sur le bouton ci-dessous pour créer un nouveau mot de passe :</p>
                <div style="text-align: center;">
                  <a href="${resetLink}" class="button">Réinitialiser mon mot de passe</a>
                </div>
                <p>Ce lien est valide pendant 1 heure.</p>
                <p>Si vous n'avez pas demandé cette réinitialisation, vous pouvez ignorer cet email en toute sécurité.</p>
                <p>Cordialement,<br>L'équipe Lendia</p>
              </div>
              <div class="footer">
                <p>Cet email a été envoyé par Lendia</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Error sending email:", error);
      throw new Error("Failed to send email");
    }

    return data;
  } catch (error) {
    console.error("Error in sendPasswordResetEmail:", error);
    throw error;
  }
}

export async function sendVerificationEmail({ to, verificationLink, userName }: SendVerificationEmailParams) {
  if (!resend) {
    console.warn("Resend API key not configured. Email sending is disabled.");
    console.log(`Verification link for ${to} (${userName}): ${verificationLink}`);
    return null;
  }
  
  try {
    const { data, error } = await resend.emails.send({
      from: "Lendia <onboarding@resend.dev>",
      to: [to],
      subject: "Vérifiez votre adresse email - Lendia",
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <style>
              body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
              .container { max-width: 600px; margin: 0 auto; padding: 20px; }
              .header { background: linear-gradient(135deg, #7c3aed 0%, #a855f7 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
              .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
              .button { display: inline-block; padding: 12px 30px; background: #7c3aed; color: white; text-decoration: none; border-radius: 6px; margin: 20px 0; }
              .footer { text-align: center; margin-top: 20px; color: #6b7280; font-size: 14px; }
            </style>
          </head>
          <body>
            <div class="container">
              <div class="header">
                <h1 style="margin: 0;">Lendia</h1>
              </div>
              <div class="content">
                <h2>Bienvenue ${userName} !</h2>
                <p>Merci de vous être inscrit sur Lendia.</p>
                <p>Pour finaliser votre inscription et accéder à votre compte, veuillez vérifier votre adresse email en cliquant sur le bouton ci-dessous :</p>
                <div style="text-align: center;">
                  <a href="${verificationLink}" class="button">Vérifier mon email</a>
                </div>
                <p>Ce lien est valide pendant 24 heures.</p>
                <p>Si vous n'avez pas créé de compte sur Lendia, vous pouvez ignorer cet email en toute sécurité.</p>
                <p>Cordialement,<br>L'équipe Lendia</p>
              </div>
              <div class="footer">
                <p>Cet email a été envoyé par Lendia</p>
              </div>
            </div>
          </body>
        </html>
      `,
    });

    if (error) {
      console.error("Error sending verification email:", error);
      throw new Error("Failed to send verification email");
    }

    return data;
  } catch (error) {
    console.error("Error in sendVerificationEmail:", error);
    throw error;
  }
}
