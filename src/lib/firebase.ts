import { initializeApp } from "firebase/app";
import {
  getFirestore,
  collection,
  addDoc,
  query,
  where,
  getDocs,
  serverTimestamp,
} from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyAz8PyS9JuIPnY5nnK_GAsHqtkiSsWmrQc",
  authDomain: "wallzy-5302a.firebaseapp.com",
  projectId: "wallzy-5302a",
  storageBucket: "wallzy-5302a.firebasestorage.app",
  messagingSenderId: "21589891742",
  appId: "1:21589891742:web:707886554d2ca5cff1b98f",
  measurementId: "G-4LB95309L8",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

export { app, db };

// Helper function to add email to waitlist
export const addToWaitlist = async (email: string) => {
  try {
    console.log("1. Starting addToWaitlist with email:", email);

    // Normalize email
    const normalizedEmail = email.trim().toLowerCase();
    console.log("2. Normalized email:", normalizedEmail);

    // Validate email
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(normalizedEmail)) {
      throw new Error("Please provide a valid email.");
    }
    console.log("3. Email validation passed");

    // Check if email already exists
    const waitlistRef = collection(db, "waitlist");
    console.log("4. Getting waitlist reference");

    const q = query(waitlistRef, where("email", "==", normalizedEmail));
    const existingDocs = await getDocs(q);
    console.log("5. Checked for existing docs, found:", existingDocs.size);

    if (!existingDocs.empty) {
      throw new Error("Looks like you're already on the list.");
    }

    // Add to waitlist
    console.log("6. About to add document to Firestore");
    const docRef = await addDoc(waitlistRef, {
      email: normalizedEmail,
      createdAt: serverTimestamp(),
    });
    console.log("7. Document added successfully with ID:", docRef.id);

    return {
      message: "Added to waitlist!",
      data: {
        email: normalizedEmail,
        timestamp: new Date().toISOString(),
      },
    };
  } catch (error: any) {
    console.error("Error adding to waitlist:", error);
    throw error;
  }
};
