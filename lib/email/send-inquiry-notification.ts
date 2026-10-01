import nodemailer from 'nodemailer';

export interface SponsorInquiryNotification {
  id: string;
  productName: string;
  websiteUrl: string;
  email: string;
  slotDuration: string;
  preferredSlot?: string;
  tagline?: string;
  notes?: string;
  createdAt: string;
}

const DEFAULT_ADMIN_EMAIL = 'mahomudulhasanrubel@gmail.com';

function formatPlanLabel(slotDuration: string): string {
  switch (slotDuration) {
    case '1-week':
    case '1-month':
      return '1 Month ($49/mo) — Starter Launch';
    case '2-weeks':
    case '2-months':
      return '2 Months ($89) — Growth Campaign (Save 10%)';
    case '1-month-legacy':
    case '3-months':
      return '3 Months ($149) — Partner Spotlight (Save 25%)';
    default:
      return slotDuration;
  }
}

/**
 * Sends an email notification to the site owner whenever a sponsor submits an inquiry.
 * Supports Resend API, SMTP (e.g. Gmail App Password), and graceful logging fallback.
 */
export async function sendInquiryNotification(
  inquiry: SponsorInquiryNotification
): Promise<{ success: boolean; method: string; error?: string }> {
  const adminEmail = process.env.ADMIN_NOTIFICATION_EMAIL || DEFAULT_ADMIN_EMAIL;
  const planLabel = formatPlanLabel(inquiry.slotDuration);
  const subject = `🔥 New Sponsor Inquiry: ${inquiry.productName} (${planLabel})`;

  const textBody = `
NEW SPONSOR INQUIRY RECEIVED ON TOPAGENTS.LOL
--------------------------------------------------
Product / Agent Name: ${inquiry.productName}
Website URL:         ${inquiry.websiteUrl}
Advertiser Email:    ${inquiry.email}
Selected Plan:       ${planLabel}
Preferred Placement: ${inquiry.preferredSlot || 'Side Rail Slot ($49/mo)'}
Tagline:             ${inquiry.tagline || 'None provided'}
Notes / Questions:   ${inquiry.notes || 'None provided'}
Submitted At:        ${new Date(inquiry.createdAt).toLocaleString()}
Inquiry ID:          ${inquiry.id}

Direct Reply Email: mailto:${inquiry.email}?subject=TopAgents%20Sponsorship%20Confirmation%20for%20${encodeURIComponent(inquiry.productName)}
View in Admin:      http://localhost:3000/admin
--------------------------------------------------
`;

  const htmlBody = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; margin: 0; padding: 24px; color: #1e293b; }
    .card { max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05); }
    .header { background: linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%); padding: 28px 32px; color: white; }
    .header h1 { margin: 0; font-size: 20px; font-weight: 900; letter-spacing: -0.02em; }
    .header p { margin: 6px 0 0 0; font-size: 13px; color: #94a3b8; }
    .content { padding: 32px; }
    .field { margin-bottom: 20px; }
    .label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.05em; color: #64748b; margin-bottom: 4px; }
    .value { font-size: 15px; font-weight: 600; color: #0f172a; word-break: break-word; }
    .value-highlight { font-size: 16px; font-weight: 800; color: #ff6154; }
    .badge { display: inline-block; padding: 4px 10px; border-radius: 9999px; font-size: 12px; font-weight: 700; background: #eff6ff; color: #1d4ed8; border: 1px solid #bfdbfe; }
    .notes-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 14px 16px; font-size: 13px; color: #334155; line-height: 1.5; }
    .actions { margin-top: 28px; padding-top: 24px; border-top: 1px solid #e2e8f0; display: flex; gap: 12px; }
    .btn { display: inline-block; padding: 12px 24px; background: #ff6154; color: white; text-decoration: none; border-radius: 12px; font-size: 13px; font-weight: 700; text-align: center; }
    .btn-secondary { display: inline-block; padding: 12px 20px; background: #f1f5f9; color: #334155; text-decoration: none; border-radius: 12px; font-size: 13px; font-weight: 700; }
    .footer { padding: 16px 32px; background: #f8fafc; border-top: 1px solid #e2e8f0; font-size: 11px; color: #94a3b8; text-align: center; }
  </style>
</head>
<body>
  <div class="card">
    <div class="header">
      <h1>🚀 New Sponsor Reservation</h1>
      <p>A new advertiser just submitted the sponsorship form on topagents.lol</p>
    </div>
    <div class="content">
      <div class="field">
        <div class="label">Product / Agent Name</div>
        <div class="value-highlight">${inquiry.productName}</div>
      </div>

      <div class="field">
        <div class="label">Official Website URL</div>
        <div class="value"><a href="${inquiry.websiteUrl}" target="_blank" style="color: #4f46e5; text-decoration: none;">${inquiry.websiteUrl} ↗</a></div>
      </div>

      <div class="field">
        <div class="label">Advertiser Email</div>
        <div class="value"><a href="mailto:${inquiry.email}" style="color: #0f172a; text-decoration: underline;">${inquiry.email}</a></div>
      </div>

      <div class="field">
        <div class="label">Selected Tier &amp; Duration</div>
        <div class="value"><span class="badge">${planLabel}</span></div>
      </div>

      <div class="field">
        <div class="label">Placement Slot</div>
        <div class="value">${inquiry.preferredSlot || 'Side Rail Sponsor Slot'}</div>
      </div>

      ${inquiry.tagline ? `
      <div class="field">
        <div class="label">Tagline</div>
        <div class="value" style="font-size: 13px; font-weight: 500; color: #475569;">"${inquiry.tagline}"</div>
      </div>` : ''}

      ${inquiry.notes ? `
      <div class="field">
        <div class="label">Advertiser Notes / Questions</div>
        <div class="notes-box">${inquiry.notes}</div>
      </div>` : ''}

      <div class="actions">
        <a href="mailto:${inquiry.email}?subject=TopAgents%20Sponsorship%20Confirmation%20for%20${encodeURIComponent(inquiry.productName)}&body=Hi%20there,%0A%0AThank%20you%20for%20reserving%20a%20sponsor%20slot%20on%20topagents.lol%20for%20${encodeURIComponent(inquiry.productName)}!%0A%0AWe%20are%20ready%20to%20activate%20your%20placement.%20Please%20find%20the%20details%20below...%0A%0ABest%20regards,%0AMahmudul%20Hasan%20Rubel%0Atopagents.lol" class="btn">Reply to Advertiser →</a>
      </div>
    </div>
    <div class="footer">
      Inquiry ID: ${inquiry.id} • topagents.lol Admin Notification
    </div>
  </div>
</body>
</html>
`;

  // 1. Try Resend API if RESEND_API_KEY is available
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey && resendApiKey.startsWith('re_')) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${resendApiKey}`,
        },
        body: JSON.stringify({
          from: process.env.RESEND_FROM_EMAIL || 'TopAgents <onboarding@resend.dev>',
          to: [adminEmail],
          subject,
          text: textBody,
          html: htmlBody,
        }),
      });

      if (res.ok) {
        console.log(`[Email Notification] Successfully sent sponsor notification via Resend to ${adminEmail}`);
        return { success: true, method: 'resend' };
      } else {
        const errText = await res.text();
        console.warn('[Email Notification] Resend API error:', errText);
      }
    } catch (err: any) {
      console.warn('[Email Notification] Resend fetch exception:', err?.message || err);
    }
  }

  // 2. Try SMTP via Nodemailer if SMTP credentials are provided
  const smtpHost = process.env.SMTP_HOST;
  const smtpUser = process.env.SMTP_USER;
  const smtpPass = process.env.SMTP_PASS;

  if (smtpHost && smtpUser && smtpPass) {
    try {
      const transporter = nodemailer.createTransport({
        host: smtpHost,
        port: Number(process.env.SMTP_PORT) || 587,
        secure: process.env.SMTP_SECURE === 'true' || Number(process.env.SMTP_PORT) === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: process.env.SMTP_FROM || `"TopAgents Sponsors" <${smtpUser}>`,
        to: adminEmail,
        subject,
        text: textBody,
        html: htmlBody,
      });

      console.log(`[Email Notification] Successfully sent sponsor notification via SMTP to ${adminEmail}`);
      return { success: true, method: 'smtp' };
    } catch (err: any) {
      console.error('[Email Notification] SMTP send error:', err?.message || err);
    }
  }

  // 3. Fallback: Log full alert to server console so details are never lost
  console.log(`\n============================================================`);
  console.log(`📢 [SPONSOR LEAD ALERT] To: ${adminEmail}`);
  console.log(textBody);
  console.log(`============================================================\n`);

  return {
    success: true,
    method: 'logged_to_admin',
  };
}
