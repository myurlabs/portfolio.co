// Firebase Configuration
// Follow these steps to set up Firebase:

// 1. Go to https://console.firebase.google.com/
// 2. Click "Create a project" (or "Add project")
// 3. Enter project name (e.g., "my-portfolio")
// 4. Disable Google Analytics (optional, not needed)
// 5. Click "Create Project"
// 6. Once created, click "Web" icon (</>) to add web app
// 7. Register app with a nickname (e.g., "portfolio-web")
// 8. Copy the firebaseConfig values below
// 9. Go to "Build" > "Firestore Database" in sidebar
// 10. Click "Create Database"
// 11. Select "Start in test mode" (for development)
// 12. Choose a location close to you
// 13. Click "Enable"

import { initializeApp } from 'firebase/app';
import { getFirestore, doc, setDoc, getDoc, collection, getDocs, deleteDoc } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// Replace these with your Firebase config values
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || ""
};

// Check if Firebase is configured
export const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey !== "" && firebaseConfig.projectId !== "";
};

// Initialize Firebase only if configured
let app: ReturnType<typeof initializeApp> | null = null;
let db: ReturnType<typeof getFirestore> | null = null;
let storage: ReturnType<typeof getStorage> | null = null;

if (isFirebaseConfigured()) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  storage = getStorage(app);
}

// ============ PROFILE ============
export const saveProfile = async (profile: any) => {
  if (!db) return false;
  try {
    await setDoc(doc(db, 'settings', 'profile'), profile);
    return true;
  } catch (error) {
    console.error('Error saving profile:', error);
    return false;
  }
};

export const getProfile = async () => {
  if (!db) return null;
  try {
    const docSnap = await getDoc(doc(db, 'settings', 'profile'));
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error('Error getting profile:', error);
    return null;
  }
};

// ============ PORTFOLIO ============
export const savePortfolio = async (portfolioItem: any) => {
  if (!db) return false;
  try {
    await setDoc(doc(db, 'portfolio', portfolioItem.id), portfolioItem);
    return true;
  } catch (error) {
    console.error('Error saving portfolio:', error);
    return false;
  }
};

export const getAllPortfolio = async () => {
  if (!db) return [];
  try {
    const querySnapshot = await getDocs(collection(db, 'portfolio'));
    return querySnapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error('Error getting portfolio:', error);
    return [];
  }
};

export const deletePortfolioItem = async (id: string) => {
  if (!db) return false;
  try {
    await deleteDoc(doc(db, 'portfolio', id));
    return true;
  } catch (error) {
    console.error('Error deleting portfolio:', error);
    return false;
  }
};

// ============ SKILLS ============
export const saveSkill = async (skill: any) => {
  if (!db) return false;
  try {
    await setDoc(doc(db, 'skills', skill.id), skill);
    return true;
  } catch (error) {
    console.error('Error saving skill:', error);
    return false;
  }
};

export const getAllSkills = async () => {
  if (!db) return [];
  try {
    const querySnapshot = await getDocs(collection(db, 'skills'));
    return querySnapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error('Error getting skills:', error);
    return [];
  }
};

export const deleteSkillItem = async (id: string) => {
  if (!db) return false;
  try {
    await deleteDoc(doc(db, 'skills', id));
    return true;
  } catch (error) {
    console.error('Error deleting skill:', error);
    return false;
  }
};

// ============ CERTIFICATIONS ============
export const saveCertification = async (cert: any) => {
  if (!db) return false;
  try {
    await setDoc(doc(db, 'certifications', cert.id), cert);
    return true;
  } catch (error) {
    console.error('Error saving certification:', error);
    return false;
  }
};

export const getAllCertifications = async () => {
  if (!db) return [];
  try {
    const querySnapshot = await getDocs(collection(db, 'certifications'));
    return querySnapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error('Error getting certifications:', error);
    return [];
  }
};

export const deleteCertificationItem = async (id: string) => {
  if (!db) return false;
  try {
    await deleteDoc(doc(db, 'certifications', id));
    return true;
  } catch (error) {
    console.error('Error deleting certification:', error);
    return false;
  }
};

// ============ COLLABORATIONS ============
export const saveCollaboration = async (collab: any) => {
  if (!db) return false;
  try {
    await setDoc(doc(db, 'collaborations', collab.id), collab);
    return true;
  } catch (error) {
    console.error('Error saving collaboration:', error);
    return false;
  }
};

export const getAllCollaborations = async () => {
  if (!db) return [];
  try {
    const querySnapshot = await getDocs(collection(db, 'collaborations'));
    return querySnapshot.docs.map(doc => doc.data());
  } catch (error) {
    console.error('Error getting collaborations:', error);
    return [];
  }
};

export const deleteCollaborationItem = async (id: string) => {
  if (!db) return false;
  try {
    await deleteDoc(doc(db, 'collaborations', id));
    return true;
  } catch (error) {
    console.error('Error deleting collaboration:', error);
    return false;
  }
};

// ============ FILE UPLOAD ============
export const uploadFile = async (file: File, path: string): Promise<string | null> => {
  if (!storage) return null;
  try {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    const url = await getDownloadURL(storageRef);
    return url;
  } catch (error) {
    console.error('Error uploading file:', error);
    return null;
  }
};

// ============ SETTINGS ============
export const saveSettings = async (settings: any) => {
  if (!db) return false;
  try {
    await setDoc(doc(db, 'settings', 'app'), settings);
    return true;
  } catch (error) {
    console.error('Error saving settings:', error);
    return false;
  }
};

export const getSettings = async () => {
  if (!db) return null;
  try {
    const docSnap = await getDoc(doc(db, 'settings', 'app'));
    return docSnap.exists() ? docSnap.data() : null;
  } catch (error) {
    console.error('Error getting settings:', error);
    return null;
  }
};

export { db, storage };
