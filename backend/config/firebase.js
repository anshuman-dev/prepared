import { Firestore } from '@google-cloud/firestore';

let db = null;

export const initializeFirestore = () => {
  if (db) return db;

  try {
    db = new Firestore({
      projectId: process.env.GOOGLE_PROJECT_ID,
      databaseId: process.env.FIRESTORE_DATABASE_ID || '(default)',
      // keyFilename will be picked up from GOOGLE_APPLICATION_CREDENTIALS env var
    });

    console.log('Firestore initialized successfully');
    return db;
  } catch (error) {
    console.error('Failed to initialize Firestore:', error);
    throw error;
  }
};

export const getFirestore = () => {
  if (!db) {
    return initializeFirestore();
  }
  return db;
};

export default getFirestore;
