import admin from 'firebase-admin';

let db = null;

export const initializeFirestore = () => {
  if (db) return db;

  try {
    // Use Firebase Admin's Firestore
    db = admin.firestore();
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
