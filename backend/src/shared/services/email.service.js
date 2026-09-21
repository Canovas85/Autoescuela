export class EmailService {
  constructor(options = {}) {
    this.provider = options.provider || process.env.EMAIL_PROVIDER || "console";
    this.from =
      options.from || process.env.EMAIL_FROM || "no-reply@autoescuela.local";
    this.fallbackFrom =
      options.fallbackFrom ||
      process.env.EMAIL_FALLBACK_FROM ||
      "onboarding@resend.dev";
    this.resendApiKey = options.resendApiKey || process.env.RESEND_API_KEY;
  }

  async sendActivationEmail({ to, nombre, activationUrl, expiresAt }) {
    const subject = "Activa tu cuenta - Autoescuela";
    const expiresText = new Date(expiresAt).toLocaleString("es-ES", {
      dateStyle: "short",
      timeStyle: "short",
    });

    const html = `
      <div style="font-family: Arial, sans-serif; line-height:1.6; color:#1f2937;">
        <h2 style="margin-bottom:8px;">Bienvenido/a ${nombre || ""}</h2>
        <p>Tu cuenta ha sido creada. Para activar el acceso, establece tu contraseña inicial usando este enlace:</p>
        <p><a href="${activationUrl}">${activationUrl}</a></p>
        <p>Este enlace caduca el <strong>${expiresText}</strong>.</p>
        <p>Si no esperabas este correo, ignóralo.</p>
      </div>
    `;

    await this.sendEmail({ to, subject, html });
  }

  async sendEmail({ to, subject, html, attachments = [] }) {
    if (this.provider === "resend") {
      await this.sendWithResend({ to, subject, html, attachments });
      return;
    }

    // Fallback local/dev: deja trazabilidad sin dependencia de proveedor.
    console.log("[EMAIL:console]", {
      to,
      subject,
      htmlPreview: String(html || "").slice(0, 180),
      attachments: attachments.map((item) => item.filename),
    });
  }

  async sendWithResend({ to, subject, html, attachments = [] }) {
    if (!this.resendApiKey) {
      throw new Error("RESEND_API_KEY no configurada");
    }

    const trySend = async (fromAddress) => {
      const response = await fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${this.resendApiKey}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [to],
          subject,
          html,
          attachments,
        }),
      });

      if (response.ok) {
        return;
      }

      const body = await response.text();
      const domainNotVerified = body
        .toLowerCase()
        .includes("domain is not verified");

      if (domainNotVerified && fromAddress !== this.fallbackFrom) {
        return trySend(this.fallbackFrom);
      }

      throw new Error(`Error enviando email con Resend: ${body}`);
    };

    await trySend(this.from);
  }
}
