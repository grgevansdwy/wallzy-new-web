# Firebase Backend Setup for Wallzy

This guide will help you set up and deploy your Firebase backend for the waitlist functionality.

## Prerequisites

- Node.js 18 or higher
- Firebase CLI installed globally: `npm install -g firebase-tools`
- Firebase project created (already done: wallzy-5302a)

## Project Structure

```
card-companion/
├── functions/           # Firebase Cloud Functions
│   ├── index.js        # Function handlers
│   └── package.json    # Functions dependencies
├── firebase.json       # Firebase configuration
├── firestore.rules     # Firestore security rules
├── firestore.indexes.json  # Database indexes
└── src/
    └── lib/
        └── firebase.ts # Frontend Firebase SDK
```

## Setup Steps

### 1. Install Firebase CLI (if not already installed)

```bash
npm install -g firebase-tools
```

### 2. Login to Firebase

```bash
firebase login
```

### 3. Install Dependencies

Install Firebase SDK in your frontend:

```bash
npm install firebase
```

Install dependencies for Cloud Functions:

```bash
cd functions
npm install
cd ..
```

### 4. Initialize Firebase (if needed)

If you need to reinitialize:

```bash
firebase init
```

Select:

- Firestore
- Functions
- Hosting (optional)

Choose existing project: `wallzy-5302a`

### 5. Deploy Firebase Backend

Deploy everything:

```bash
firebase deploy
```

Or deploy specific services:

```bash
# Deploy only functions
firebase deploy --only functions

# Deploy only Firestore rules
firebase deploy --only firestore:rules

# Deploy only hosting
firebase deploy --only hosting
```

## API Endpoints

After deployment, your functions will be available at:

### Add to Waitlist

- **Endpoint**: `https://us-central1-wallzy-5302a.cloudfunctions.net/addToWaitlist`
- **Method**: POST
- **Body**: `{ "email": "user@example.com" }`
- **Response**:
  ```json
  {
    "message": "Added to waitlist!",
    "data": {
      "email": "user@example.com",
      "createdAt": "2026-01-22T00:00:00.000Z"
    }
  }
  ```

### Get Waitlist Entries (Admin)

- **Endpoint**: `https://us-central1-wallzy-5302a.cloudfunctions.net/getWaitlist?limit=250`
- **Method**: GET
- **Response**: Array of waitlist entries

### Export Waitlist as CSV (Admin)

- **Endpoint**: `https://us-central1-wallzy-5302a.cloudfunctions.net/exportWaitlistCSV`
- **Method**: GET
- **Response**: CSV file download

### Health Check

- **Endpoint**: `https://us-central1-wallzy-5302a.cloudfunctions.net/healthCheck`
- **Method**: GET
- **Response**: `{ "status": "ok" }`

## Frontend Integration

The waitlist form in `WaitlistSection.tsx` is already integrated with Firebase. It will:

1. Submit email to Firebase Cloud Function
2. Show loading state during submission
3. Display success message when email is added
4. Show error message if submission fails
5. Handle duplicate emails gracefully

## Local Development

To test functions locally:

```bash
# Start Firebase emulators
firebase emulators:start

# In another terminal, update firebase.ts to use emulator
# Uncomment this line in src/lib/firebase.ts:
# connectFunctionsEmulator(functions, "localhost", 5001);
```

## Security

- Firestore rules deny direct client access to the waitlist collection
- All operations go through secured Cloud Functions
- Email validation is enforced server-side
- CORS is enabled for your domain

## Monitoring

View logs in Firebase Console:

```bash
firebase functions:log
```

Or in the Firebase Console:
https://console.firebase.google.com/project/wallzy-5302a/functions

## Cost Estimation

Firebase free tier includes:

- 2M Cloud Function invocations/month
- 1GB Firestore storage
- 10GB network egress

Your waitlist should comfortably fit within the free tier.

## Troubleshooting

### Functions not deploying

```bash
# Check Node version (must be 18)
node --version

# Clear cache and redeploy
cd functions
rm -rf node_modules package-lock.json
npm install
cd ..
firebase deploy --only functions
```

### CORS errors

The functions already have CORS enabled. If you still see errors, check that your domain is accessible.

### Duplicate email detection not working

Make sure the Firestore index is deployed:

```bash
firebase deploy --only firestore:indexes
```

## Admin Dashboard (Optional)

To view waitlist entries, you can:

1. Use Firebase Console: https://console.firebase.google.com/project/wallzy-5302a/firestore
2. Call the getWaitlist function from your browser console:
   ```javascript
   fetch("https://us-central1-wallzy-5302a.cloudfunctions.net/getWaitlist")
     .then((r) => r.json())
     .then(console.log);
   ```
3. Export CSV directly:
   ```
   https://us-central1-wallzy-5302a.cloudfunctions.net/exportWaitlistCSV
   ```

## Migration from Flask

Your Flask endpoints have been replaced as follows:

| Flask Endpoint     | Firebase Function | Status      |
| ------------------ | ----------------- | ----------- |
| POST /api/waitlist | addToWaitlist     | ✅ Migrated |
| GET /api/waitlist  | getWaitlist       | ✅ Migrated |
| GET /waitlist.csv  | exportWaitlistCSV | ✅ Migrated |
| GET /healthz       | healthCheck       | ✅ Migrated |

## Next Steps

1. Deploy functions: `firebase deploy --only functions`
2. Test the waitlist form on your site
3. Set up Firebase Console access for your team
4. (Optional) Add Google Analytics integration
5. (Optional) Set up automated email notifications using SendGrid/Mailgun

## Support

- Firebase Docs: https://firebase.google.com/docs
- Cloud Functions: https://firebase.google.com/docs/functions
- Firestore: https://firebase.google.com/docs/firestore
