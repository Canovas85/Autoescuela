export class EmailService {
  constructor(options = {}) {
    this.provider = options.provider || process.env.EMAIL_PROVIDER || "console";
    this.from =
      options.from || process.env.EMAIL_FROM || "no-reply@autoescuela.local";
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

    if (this.provider === "resend") {
      await this.sendWithResend({ to, subject, html });
      return;
    }

    // Fallback local/dev: deja trazabilidad sin dependencia de proveedor.
    console.log("[EMAIL:console]", { to, subject, activationUrl, expiresAt });
  }

  async sendWithResend({ to, subject, html }) {
    if (!this.resendApiKey) {
      throw new Error("RESEND_API_KEY no configurada");
    }

    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.resendApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: this.from,
        to: [to],
        subject,
        html,
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      throw new Error(`Error enviando email con Resend: ${body}`);
    }
  }
}
