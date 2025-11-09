import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export interface SendPasswordResetEmailParams {
  to: string;
  resetLink: string;
  userName: string;
}

export async function sendPasswordResetEmail({ to, resetLink, userName }: SendPasswordResetEmailParams) {
  try {
    const { data, error } = await resend.emails.send({
      from: "Altus Finance <onboarding@resend.dev>",
      to: [to],
      subject: "Réinitialisation de votre mot de passe - Altus Finance",
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
                <h1 style="margin: 0;">Altus Finance</h1>
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
                <p>Cordialement,<br>L'équipe Altus Finance</p>
              </div>
              <div class="footer">
                <p>Cet email a été envoyé par Altus Finance</p>
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
