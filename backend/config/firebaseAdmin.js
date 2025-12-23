import admin from 'firebase-admin';

let firebaseAdmin = null;

export const initializeFirebaseAdmin = () => {
  if (firebaseAdmin) return firebaseAdmin;

  try {
    // Initialize with service account (recommended for production)
    if (process.env.GOOGLE_APPLICATION_CREDENTIALS) {
      firebaseAdmin = admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: process.env.GOOGLE_PROJECT_ID
      });
    } else {
      // Fallback: initialize without credentials (uses ADC - Application Default Credentials)
      firebaseAdmin = admin.initializeApp({
        projectId: process.env.GOOGLE_PROJECT_ID
      });
    }

    console.log('Firebase Admin initialized successfully');
    return firebaseAdmin;
  } catch (error) {
    console.error('Failed to initialize Firebase Admin:', error);
    throw error;
  }
};

export const getFirebaseAdmin = () => {
  if (!firebaseAdmin) {
    return initializeFirebaseAdmin();
  }
  return firebaseAdmin;
};

export default { initializeFirebaseAdmin, getFirebaseAdmin };
