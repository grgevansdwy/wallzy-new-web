import type { VercelRequest, VercelResponse } from "@vercel/node";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface RecommendedCard {
  name: string;
  bestFor: string;
  special: string;
}

interface BreakdownItem {
  category: string;
  currentRate: number;
  optimalRate: number;
  monthlySaving: number;
}

interface ResultsPayload {
  email: string;
  annualLoss: number;
  recommendedCards: RecommendedCard[];
  breakdown: BreakdownItem[];
  explanation: string;
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Only allow POST
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { email, annualLoss, recommendedCards, breakdown, explanation } =
      req.body as ResultsPayload;

    // Validate email
    if (!email || !email.includes("@")) {
      return res.status(400).json({ error: "Invalid email address" });
    }

    // Build the email HTML
    const cardsHtml = recommendedCards
      .map(
        (card, i) => `
        <tr>
          <td style="padding: 16px; background: #f8fafc; border-radius: 8px; margin-bottom: 8px;">
            <div style="display: flex; align-items: flex-start; gap: 12px;">
              <div style="width: 28px; height: 28px; background: #FFC402; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: #00438A; font-weight: bold; font-size: 14px;">
                ${i + 1}
              </div>
              <div>
                <div style="font-weight: 600; color: #00438A; font-size: 16px;">${card.name}</div>
                <div style="color: #5493D5; font-size: 14px;">${card.bestFor}</div>
                <div style="color: #64748b; font-size: 13px; margin-top: 4px;">${card.special}</div>
              </div>
            </div>
          </td>
        </tr>
        <tr><td style="height: 8px;"></td></tr>
      `
      )
      .join("");

    const breakdownHtml = breakdown
      .map(
        (item) => `
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0;">
            <span style="color: #64748b;">${item.category}</span>
          </td>
          <td style="padding: 8px 0; border-bottom: 1px solid #e2e8f0; text-align: right;">
            <span style="color: #94a3b8;">${item.currentRate.toFixed(0)}%</span>
            <span style="color: #cbd5e1; margin: 0 4px;">→</span>
            <span style="color: #5493D5; font-weight: 500;">${item.optimalRate.toFixed(0)}%</span>
            <span style="color: #FFC402; font-weight: 600; margin-left: 8px;">+$${item.monthlySaving.toFixed(0)}/mo</span>
          </td>
        </tr>
      `
      )
      .join("");

    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Your Credit Card Portfolio Results</title>
</head>
<body style="margin: 0; padding: 0; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; background-color: #f1f5f9;">
  <table width="100%" cellpadding="0" cellspacing="0" style="max-width: 600px; margin: 0 auto; padding: 20px;">
    <tr>
      <td>
        <!-- Header -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #00438A; border-radius: 12px 12px 0 0; padding: 32px; text-align: center;">
          <tr>
            <td>
              <h1 style="color: #ffffff; margin: 0 0 8px 0; font-size: 24px;">Your Portfolio Results</h1>
              <p style="color: #5493D5; margin: 0; font-size: 14px;">from Wallzy Wallet</p>
            </td>
          </tr>
        </table>

        <!-- Main Content -->
        <table width="100%" cellpadding="0" cellspacing="0" style="background: #ffffff; padding: 32px;">
          <!-- Annual Loss Highlight -->
          <tr>
            <td style="text-align: center; padding-bottom: 32px;">
              <p style="color: #64748b; margin: 0 0 8px 0; font-size: 14px;">You're leaving on the table annually:</p>
              <p style="color: #FFC402; margin: 0; font-size: 48px; font-weight: 700;">$${annualLoss.toFixed(0)}</p>
              <p style="color: #94a3b8; margin: 8px 0 0 0; font-size: 13px;">That's $${(annualLoss / 12).toFixed(0)}/month in lost rewards</p>
            </td>
          </tr>

          <!-- Breakdown -->
          ${
            breakdown.length > 0
              ? `
          <tr>
            <td style="padding-bottom: 24px;">
              <h2 style="color: #00438A; font-size: 18px; margin: 0 0 16px 0;">Savings Breakdown</h2>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${breakdownHtml}
              </table>
            </td>
          </tr>
          `
              : ""
          }

          <!-- Recommended Cards -->
          <tr>
            <td style="padding-bottom: 24px;">
              <h2 style="color: #00438A; font-size: 18px; margin: 0 0 16px 0;">Your Recommended Portfolio</h2>
              <table width="100%" cellpadding="0" cellspacing="0">
                ${cardsHtml}
              </table>
            </td>
          </tr>

          <!-- Explanation -->
          <tr>
            <td style="background: #f8fafc; border-radius: 8px; padding: 16px;">
              <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0;">
                ${explanation.replace(/\*\*(.*?)\*\*/g, "<strong style='color: #00438A;'>$1</strong>")}
              </p>
            </td>
          </tr>
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

    // Send the email
    const { data, error } = await resend.emails.send({
      from: "Wallzy Wallet <no-reply@wallzywallet.com>",
      to: [email],
      subject: `Your Optimized Credit Card Portfolio - Save $${annualLoss.toFixed(0)}/year`,
      html: htmlContent,
    });

    if (error) {
      console.error("Resend error:", error);
      return res.status(500).json({ error: "Failed to send email" });
    }

    return res.status(200).json({ success: true, id: data?.id });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
