import crypto from "crypto";

export interface EmailOptions {
    to: string;
    subject: string;
    html: string;
}

export const EmailService = {
    /**
     * Sends an email. In development, logs to console.
     * In production, integrate with Resend, SendGrid, or Nodemailer.
     */
    send: async (options: EmailOptions): Promise<void> => {
        const isDev = process.env.NODE_ENV === "development";

        if (isDev) {
            console.log("\n📧 ===== EMAIL SENT (DEV MODE) =====");
            console.log(`To: ${options.to}`);
            console.log(`Subject: ${options.subject}`);
            console.log(`Body:\n${options.html}`);
            console.log("=====================================\n");
            return;
        }

        // TODO: Integrate with real email service
        // Example with Resend:
        // const resend = new Resend(process.env.RESEND_API_KEY);
        // await resend.emails.send({
        //   from: 'noreply@vetdrpaw.com',
        //   to: options.to,
        //   subject: options.subject,
        //   html: options.html,
        // });

        throw new Error("Email service not configured for production");
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
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 10px 10px 0 0; }
            .content { background: #f9f9f9; padding: 30px; border-radius: 0 0 10px 10px; }
            .button { display: inline-block; padding: 15px 30px; background: #667eea; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 20px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🐾 Bienvenido a VetDrPaw</h1>
            </div>
            <div class="content">
              <h2>Hola ${name},</h2>
              <p>Tu veterinario ha creado una cuenta para ti en VetDrPaw. Ahora puedes acceder a toda la información médica de tus mascotas en un solo lugar.</p>
              
              <p>Para activar tu cuenta y establecer tu contraseña, haz clic en el siguiente botón:</p>
              
              <div style="text-align: center;">
                <a href="${activationUrl}" class="button">Activar Mi Cuenta</a>
              </div>
              
              <p>O copia y pega este enlace en tu navegador:</p>
              <p style="background: #fff; padding: 10px; border-radius: 5px; word-break: break-all;">
                ${activationUrl}
              </p>
              
              <p><strong>Este enlace expirará en 7 días.</strong></p>
              
              <p>Si no solicitaste esta cuenta, puedes ignorar este correo.</p>
              
              <p>Saludos,<br>El equipo de VetDrPaw</p>
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
            subject: "Activa tu cuenta en VetDrPaw 🐾",
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
