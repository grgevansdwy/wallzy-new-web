import type { VercelRequest, VercelResponse } from "@vercel/node";

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({ error: "Method not allowed" });

  const { email, source = "unknown" } = req.body ?? {};

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
    return res.status(400).json({ error: "Invalid email address" });
  }

  const normalizedEmail = email.trim().toLowerCase();
  const projectId = process.env.VITE_FIREBASE_PROJECT_ID;
  const apiKey = process.env.VITE_FIREBASE_API_KEY;

  try {
    // Check for duplicate
    const queryRes = await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents:runQuery?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          structuredQuery: {
            from: [{ collectionId: "waitlist" }],
            where: {
              fieldFilter: {
                field: { fieldPath: "email" },
                op: "EQUAL",
                value: { stringValue: normalizedEmail },
              },
            },
            limit: 1,
          },
        }),
      }
    );
    const queryData = await queryRes.json();
    const alreadyExists = queryData.some((r: any) => r.document);

    if (alreadyExists) {
      return res.status(200).json({ success: true, alreadyExists: true });
    }

    await fetch(
      `https://firestore.googleapis.com/v1/projects/${projectId}/databases/(default)/documents/waitlist?key=${apiKey}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fields: {
            email: { stringValue: normalizedEmail },
            source: { stringValue: source },
            createdAt: { timestampValue: new Date().toISOString() },
          },
        }),
      }
    );

    return res.status(200).json({ success: true });
  } catch (err) {
    console.error("Firestore error:", err);
    return res.status(500).json({ error: "Internal server error" });
  }
}
