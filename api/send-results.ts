import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface CardAction {
  name: string;
  reason: string;
  anv?: number;
  downgrade?: string;
  upgradeFrom?: string;
}

interface Strategy {
  apply: CardAction[];
  keep: CardAction[];
  remove: CardAction[];
  upgrade: CardAction[];
  improvement: number;
}

interface ResultsPayload {
  email: string;
  strategy: Strategy;
}

function renderCardRows(cards: CardAction[], label: string, color: string): string {
  if (!cards || cards.length === 0) return "";
  return `
    <tr>
      <td style="padding-bottom: 8px;">
        <h3 style="color: ${color}; font-size: 15px; margin: 0 0 8px 0;">${label}</h3>
        <table width="100%" cellpadding="0" cellspacing="0">
          ${cards
            .map(
              (card) => `
            <tr>
              <td style="padding: 12px; background: #f8fafc; border-radius: 8px; margin-bottom: 6px; border-left: 3px solid ${color};">
                <div style="font-weight: 600; color: #00438A; font-size: 15px;">${card.name}</div>
                <div style="color: #64748b; font-size: 13px; margin-top: 4px;">${card.reason}</div>
                ${card.anv ? `<div style="color: #FFC402; font-size: 13px; font-weight: 600; margin-top: 4px;">+$${card.anv.toFixed(0)}/yr net value</div>` : ""}
                ${card.downgrade ? `<div style="color: #94a3b8; font-size: 12px; margin-top: 4px;">Downgrade to: ${card.downgrade}</div>` : ""}
                ${card.upgradeFrom ? `<div style="color: #94a3b8; font-size: 12px; margin-top: 4px;">Upgrade from: ${card.upgradeFrom}</div>` : ""}
              </td>
            </tr>
            <tr><td style="height: 6px;"></td></tr>
          `
            )
            .join("")}
        </table>
      </td>
    </tr>
    <tr><td style="height: 16px;"></td></tr>
  `;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, strategy } = req.body as ResultsPayload;

    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    if (!strategy) {
      return res.status(400).json({ error: "Missing strategy data" });
    }

    const annualImprovement = strategy.improvement ?? 0;

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Credit Card Portfolio Strategy</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f1f5f9;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td>
        <!-- Header -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #00438A; border-radius: 12px 12px 0 0; padding: 32px; text-align: center;">
          <tr>
            <td>
              <h1 style="color: #ffffff; margin: 0 0 8px 0; font-size: 24px;">Your Portfolio Strategy</h1>
              <p style="color: #5493D5; margin: 0; font-size: 14px;">from Wallzy Wallet</p>
            </td>
          </tr>
        </table>

        <!-- Main Content -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #ffffff; padding: 32px;">
          <!-- Annual Improvement -->
          <tr>
            <td style="text-align: center; padding-bottom: 32px;">
              <p style="color: #64748b; margin: 0 0 8px 0; font-size: 14px;">Your potential annual rewards improvement:</p>
              <p style="color: #FFC402; margin: 0; font-size: 48px; font-weight: 700;">+$${annualImprovement.toFixed(0)}</p>
              <p style="color: #94a3b8; margin: 8px 0 0 0; font-size: 13px;">That's $${(annualImprovement / 12).toFixed(0)}/month more in rewards</p>
            </td>
          </tr>

          ${renderCardRows(strategy.apply, "Apply For", "#10b981")}
          ${renderCardRows(strategy.upgrade, "Upgrade", "#3b82f6")}
          ${renderCardRows(strategy.keep, "Keep", "#00438A")}
          ${renderCardRows(strategy.remove, "Remove / Downgrade", "#ef4444")}
        </table>

        <!-- Footer -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #00438A; border-radius: 0 0 12px 12px; padding: 24px; text-align: center;">
          <tr>
            <td>
              <p style="color: #5493D5; margin: 0 0 8px 0; font-size: 13px;">
                Start building your optimized portfolio today!
              </p>
              <a href="https://wallzywallet.com" style="color: #FFC402; font-size: 14px; text-decoration: none; font-weight: 500;">
                Learn more about Wallzy →
              </a>
              <p style="color: #5493D5; margin: 16px 0 0 0; font-size: 11px; opacity: 0.8;">
                © ${new Date().getFullYear()} Wallzy Wallet. All rights reserved.
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
    `;

    const { data, error } = await resend.emails.send({
      from: "Wallzy Wallet <no-reply@wallzywallet.com>",
      to: [email],
      subject: `Your Optimized Credit Card Portfolio — +$${annualImprovement.toFixed(0)}/year`,
      html: htmlContent,
    });

    if (error) {
      console.error("Resend error:", JSON.stringify(error));
      return res.status(500).json({ error: "Failed to send email", detail: error });
    }

    return res.status(200).json({ success: true, id: data?.id });
  } catch (err) {
    console.error("Server error:", err);
    return res.status(500).json({ error: "Internal server error", detail: String(err) });
  }
}
