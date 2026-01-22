const functions = require("firebase-functions");
const admin = require("firebase-admin");
const cors = require("cors")({ origin: true });

admin.initializeApp();
const db = admin.firestore();

// Email validation regex
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Add email to waitlist
 * POST /api/waitlist
 * Body: { email: string }
 */
exports.addToWaitlist = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    // Only allow POST requests
    if (req.method !== "POST") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    try {
      const { email } = req.body;

      // Validate email
      if (!email || typeof email !== "string") {
        return res.status(400).json({ message: "Email is required" });
      }

      const normalizedEmail = email.trim().toLowerCase();

      if (!EMAIL_REGEX.test(normalizedEmail)) {
        return res
          .status(400)
          .json({ message: "Please provide a valid email." });
      }

      // Check if email already exists
      const waitlistRef = db.collection("waitlist");
      const existingQuery = await waitlistRef
        .where("email", "==", normalizedEmail)
        .limit(1)
        .get();

      if (!existingQuery.empty) {
        const existingDoc = existingQuery.docs[0];
        return res.status(200).json({
          message: "Looks like you're already on the list.",
          duplicate: true,
          data: {
            email: existingDoc.data().email,
            createdAt: existingDoc.data().createdAt.toDate().toISOString(),
          },
        });
      }

      // Add to waitlist
      const docRef = await waitlistRef.add({
        email: normalizedEmail,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Fetch the created document
      const newDoc = await docRef.get();

      return res.status(201).json({
        message: "Added to waitlist!",
        data: {
          email: newDoc.data().email,
          createdAt: newDoc.data().createdAt.toDate().toISOString(),
        },
      });
    } catch (error) {
      console.error("Error adding to waitlist:", error);
      return res.status(500).json({
        message: "An error occurred. Please try again.",
      });
    }
  });
});

/**
 * Get waitlist entries
 * GET /api/waitlist?limit=250
 */
exports.getWaitlist = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    // Only allow GET requests
    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    try {
      const limit = Math.min(parseInt(req.query.limit) || 250, 1000);

      const waitlistRef = db.collection("waitlist");
      const snapshot = await waitlistRef
        .orderBy("createdAt", "desc")
        .limit(limit)
        .get();

      const entries = snapshot.docs.map((doc) => ({
        email: doc.data().email,
        createdAt: doc.data().createdAt.toDate().toISOString(),
      }));

      return res.status(200).json(entries);
    } catch (error) {
      console.error("Error fetching waitlist:", error);
      return res.status(500).json({
        message: "An error occurred. Please try again.",
      });
    }
  });
});

/**
 * Export waitlist as CSV
 * GET /api/waitlist/csv
 */
exports.exportWaitlistCSV = functions.https.onRequest((req, res) => {
  return cors(req, res, async () => {
    // Only allow GET requests
    if (req.method !== "GET") {
      return res.status(405).json({ message: "Method not allowed" });
    }

    try {
      const waitlistRef = db.collection("waitlist");
      const snapshot = await waitlistRef.orderBy("createdAt", "desc").get();

      // Generate CSV
      let csv = "email,created_at\n";
      snapshot.docs.forEach((doc) => {
        const data = doc.data();
        const createdAt = data.createdAt.toDate().toISOString();
        csv += `${data.email},${createdAt}\n`;
      });

      res.setHeader("Content-Type", "text/csv");
      res.setHeader("Content-Disposition", "attachment; filename=waitlist.csv");
      return res.status(200).send(csv);
    } catch (error) {
      console.error("Error exporting CSV:", error);
      return res.status(500).json({
        message: "An error occurred. Please try again.",
      });
    }
  });
});

/**
 * Health check endpoint
 * GET /api/health
 */
exports.healthCheck = functions.https.onRequest((req, res) => {
  return cors(req, res, () => {
    return res.status(200).json({ status: "ok" });
  });
});
