// src/services/email.service.ts
import nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST,       // smtp.resend.com oppure smtp-relay.brevo.com
  port: 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
})

export const emailService = {
  sendMagicLink: async (email: string, token: string, type: 'login' | 'verify-email' = 'login') => {
    const url = `${Bun.env.HOST_URL}/auth/magic/verify?token=${token}`

    await transporter.sendMail({
      from: `"Versify" <${Bun.env.SMTP_FROM}>`, 
      to: email,
      subject: 'Your magic link to Versify',
      html: `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
</head>
<body style="margin:0;padding:0;background-color:#0f0f0f;font-family:'Georgia',serif;">

  <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#0f0f0f;padding:32px 0;">
    <tr>
      <td align="center">
        <table width="520" cellpadding="0" cellspacing="0" style="background-color:#1a1a1a;border-radius:12px;overflow:hidden;border:1px solid #2e2e2e;">

          <!-- HEADER -->
          <tr>
            <td style="background:linear-gradient(135deg,#1a1a2e,#16213e);padding:24px 40px;text-align:center;border-bottom:1px solid #2e2e2e;">
              <h1 style="margin:0;font-size:28px;color:#ffffff;font-weight:normal;letter-spacing:2px;">Versify</h1>
              <p style="margin:4px 0 0 0;font-size:11px;color:#8b7cf6;letter-spacing:3px;text-transform:uppercase;">the poetry platform</p>
            </td>
          </tr>

          <!-- BODY -->
          <tr>
            <td style="padding:32px 40px;text-align:center;">
              <p style="margin:0 0 6px 0;font-size:15px;color:#cccccc;">Click the button below to sign in.</p>
              <p style="margin:0 0 28px 0;font-size:12px;color:#555;">This link expires in <strong style="color:#aaa;">15 minutes</strong> and can only be used once.</p>

              <!-- CTA -->
              <a href="${url}" style="display:inline-block;background:linear-gradient(135deg,#8b7cf6,#6d5ce7);color:#ffffff;text-decoration:none;padding:14px 44px;border-radius:8px;font-size:15px;letter-spacing:1px;font-family:sans-serif;">
                Sign in to Versify
              </a>
            </td>
          </tr>

          <!-- FOOTER -->
          <tr>
            <td style="background-color:#111;padding:16px 40px;text-align:center;border-top:1px solid #2e2e2e;">
              <p style="margin:0;font-size:11px;color:#444;">
                Didn't request this? Ignore this email — your account is safe.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>

</body>
</html>
      `,
    })
  }
}