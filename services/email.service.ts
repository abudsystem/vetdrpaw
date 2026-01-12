import crypto from "crypto";
import { Resend } from "resend";

export interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

// Initialize Resend only if API key is available
const resend = process.env.RESEND_API_KEY ? new Resend(process.env.RESEND_API_KEY) : null;

export const EmailService = {
  /**
   * Sends an email using Resend in production, logs to console in development
   */
  send: async (options: EmailOptions): Promise<void> => {
    const isDev = process.env.NODE_ENV === "development";
    const hasResendKey = !!process.env.RESEND_API_KEY;
    const forceSend = process.env.SEND_REAL_EMAILS === "true";

    console.log("🔍 [EmailService Debug]:", {
      isDev,
      hasResendKey,
      resendKeyPrefix: process.env.RESEND_API_KEY ? process.env.RESEND_API_KEY.substring(0, 5) : "none",
      forceSend,
      nodeEnv: process.env.NODE_ENV,
      sendRealEmails: process.env.SEND_REAL_EMAILS
    });

    // Development mode (without force) or no Resend key: log to console
    if ((isDev && !forceSend) || !hasResendKey) {
      console.log("\n📧 ===== EMAIL SENDING SKIPPED (MOCK MODE) =====");
      console.log(`Reason: ${!hasResendKey ? "Missing RESEND_API_KEY" : (isDev && !forceSend ? "Development mode (SEND_REAL_EMAILS != true)" : "Unknown")}`);
      console.log(`To: ${options.to}`);
      console.log(`Subject: ${options.subject}`);
      console.log("================================================\n");
      return;
    }

    // Production mode with Resend
    try {
      const fromEmail = process.env.RESEND_FROM_EMAIL || "Veterinaria DrPaw <noreply@vetetinariadrpaw.com>";

      await resend!.emails.send({
        from: fromEmail,
        to: options.to,
        subject: options.subject,
        html: options.html,
      });

      console.log(`✅ Email sent successfully to ${options.to}`);
    } catch (error) {
      console.error("❌ Error sending email with Resend:", error);
      throw new Error("Failed to send email");
    }
  },

  /**
   * Sends activation email to guest user
   */
  sendActivationEmail: async (
    email: string,
    name: string,
    token: string
  ): Promise<void> => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const activationUrl = `${baseUrl}/activar?token=${token}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #0d9488 0%, #0f766e 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
            .content { background: #f9fafb; padding: 40px 30px; border-radius: 0 0 12px 12px; }
            .content h2 { color: #0f766e; margin-top: 0; }
            .button { display: inline-block; padding: 16px 32px; background: #0d9488; color: white !important; text-decoration: none; border-radius: 8px; margin: 24px 0; font-weight: 600; box-shadow: 0 4px 6px rgba(13, 148, 136, 0.2); }
            .button:hover { background: #0f766e; }
            .url-box { background: #fff; padding: 16px; border-radius: 8px; word-break: break-all; border: 1px solid #e5e7eb; margin: 16px 0; }
            .footer { text-align: center; margin-top: 24px; color: #6b7280; font-size: 13px; }
            .highlight { background: #ccfbf1; padding: 12px; border-radius: 6px; border-left: 4px solid #0d9488; margin: 16px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🐾 Bienvenido a Veterinaria DrPaw</h1>
            </div>
            <div class="content">
              <h2>Hola ${name},</h2>
              <p>Tu veterinario ha creado una cuenta para ti en Veterinaria DrPaw. Ahora puedes acceder a toda la información médica de tus mascotas en un solo lugar.</p>
              
              <p>Para activar tu cuenta y establecer tu contraseña, haz clic en el siguiente botón:</p>
              
              <div style="text-align: center;">
                <a href="${activationUrl}" class="button">Activar Mi Cuenta</a>
              </div>
              
              <p>O copia y pega este enlace en tu navegador:</p>
              <p class="url-box">
                ${activationUrl}
              </p>
              
              <p><strong>Este enlace expirará en 7 días.</strong></p>
              
              <p>Si no solicitaste esta cuenta, puedes ignorar este correo.</p>
              
              <p>Saludos,<br>El equipo de Veterinaria DrPaw</p>
            </div>
            <div class="footer">
              <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await EmailService.send({
      to: email,
      subject: "Activa tu cuenta en Veterinaria DrPaw 🐾",
      html,
    });
  },

  /**
   * Sends password reset email
   */
  sendPasswordResetEmail: async (
    email: string,
    name: string,
    token: string
  ): Promise<void> => {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || "http://localhost:3000";
    const resetUrl = `${baseUrl}/restablecer-contrasena?token=${token}`;

    const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 0; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #a855f7 0%, #6366f1 100%); color: white; padding: 40px 30px; text-align: center; border-radius: 12px 12px 0 0; }
            .header h1 { margin: 0; font-size: 28px; font-weight: 700; }
            .content { background: #f9fafb; padding: 40px 30px; border-radius: 0 0 12px 12px; }
            .content h2 { color: #6366f1; margin-top: 0; }
            .button { display: inline-block; padding: 16px 32px; background: #a855f7; color: white !important; text-decoration: none; border-radius: 8px; margin: 24px 0; font-weight: 600; box-shadow: 0 4px 6px rgba(168, 85, 247, 0.2); }
            .button:hover { background: #9333ea; }
            .url-box { background: #fff; padding: 16px; border-radius: 8px; word-break: break-all; border: 1px solid #e5e7eb; margin: 16px 0; }
            .footer { text-align: center; margin-top: 24px; color: #6b7280; font-size: 13px; }
            .warning { background: #fef3c7; padding: 12px; border-radius: 6px; border-left: 4px solid #f59e0b; margin: 16px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🔒 Recuperación de Contraseña</h1>
            </div>
            <div class="content">
              <h2>Hola ${name},</h2>
              <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta en Veterinaria DrPaw.</p>
              
              <p>Para crear una nueva contraseña, haz clic en el siguiente botón:</p>
              
              <div style="text-align: center;">
                <a href="${resetUrl}" class="button">Restablecer Mi Contraseña</a>
              </div>
              
              <p>O copia y pega este enlace en tu navegador:</p>
              <p class="url-box">
                ${resetUrl}
              </p>
              
              <div class="warning">
                <p><strong>⏰ Este enlace expirará en 24 horas.</strong></p>
              </div>
              
              <p>Si no solicitaste restablecer tu contraseña, puedes ignorar este correo de forma segura. Tu contraseña actual seguirá siendo válida.</p>
              
              <p>Saludos,<br>El equipo de Veterinaria DrPaw</p>
            </div>
            <div class="footer">
              <p>Este es un correo automático, por favor no respondas a este mensaje.</p>
            </div>
          </div>
        </body>
      </html>
    `;

    await EmailService.send({
      to: email,
      subject: "Recupera tu contraseña - Veterinaria DrPaw 🔒",
      html,
    });
  },

  /**
   * Generates a secure random token
   */
  generateToken: (): string => {
    return crypto.randomBytes(32).toString("hex");
  },
};
