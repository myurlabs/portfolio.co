import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  collection,
  getDocs,
  deleteDoc,
} from "firebase/firestore";
import {
  getStorage,
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

// ================= FIREBASE CONFIG =================

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "",
};

export const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey !== "" && firebaseConfig.projectId !== "";
};

let app: any = null;
let db: any = null;
let storage: any = null;

if (isFirebaseConfigured()) {
  app = initializeApp(firebaseConfig);
  db = getFirestore(app);
  storage = getStorage(app);
}

// ================= FULL STORE SYNC =================

// 🔥 This saves entire Zustand store in one doc
export const saveFullStore = async (state: any) => {
  if (!db) return false;
  try {
    await setDoc(doc(db, "app", "state"), state);
    return true;
  } catch (error) {
    console.error("Error saving full store:", error);
    return false;
  }
};

export const loadFullStore = async () => {
  if (!db) return null;
  try {
    const snap = await getDoc(doc(db, "app", "state"));
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    console.error("Error loading full store:", error);
    return null;
  }
};

// ================= PROFILE =================

export const saveProfile = async (profile: any) => {
  if (!db) return false;
  try {
    await setDoc(doc(db, "profile", "main"), profile);
    return true;
  } catch (error) {
    console.error("Error saving profile:", error);
    return false;
  }
};

export const getProfile = async () => {
  if (!db) return null;
  try {
    const snap = await getDoc(doc(db, "profile", "main"));
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    console.error("Error getting profile:", error);
    return null;
  }
};

// ================= PORTFOLIO =================

export const savePortfolio = async (item: any) => {
  if (!db) return false;
  try {
    await setDoc(doc(db, "portfolio", item.id), item);
    return true;
  } catch (error) {
    console.error("Error saving portfolio:", error);
    return false;
  }
};

export const getAllPortfolio = async () => {
  if (!db) return [];
  try {
    const snap = await getDocs(collection(db, "portfolio"));
    return snap.docs.map((d) => d.data());
  } catch (error) {
    console.error("Error getting portfolio:", error);
    return [];
  }
};

export const deletePortfolioItem = async (id: string) => {
  if (!db) return false;
  try {
    await deleteDoc(doc(db, "portfolio", id));
    return true;
  } catch (error) {
    console.error("Error deleting portfolio:", error);
    return false;
  }
};

// ================= SKILLS =================

export const saveSkill = async (skill: any) => {
  if (!db) return false;
  try {
    await setDoc(doc(db, "skills", skill.id), skill);
    return true;
  } catch (error) {
    console.error("Error saving skill:", error);
    return false;
  }
};

export const getAllSkills = async () => {
  if (!db) return [];
  try {
    const snap = await getDocs(collection(db, "skills"));
    return snap.docs.map((d) => d.data());
  } catch (error) {
    console.error("Error getting skills:", error);
    return [];
  }
};

export const deleteSkillItem = async (id: string) => {
  if (!db) return false;
  try {
    await deleteDoc(doc(db, "skills", id));
    return true;
  } catch (error) {
    console.error("Error deleting skill:", error);
    return false;
  }
};

// ================= CERTIFICATIONS =================

export const saveCertification = async (cert: any) => {
  if (!db) return false;
  try {
    await setDoc(doc(db, "certifications", cert.id), cert);
    return true;
  } catch (error) {
    console.error("Error saving certification:", error);
    return false;
  }
};

export const getAllCertifications = async () => {
  if (!db) return [];
  try {
    const snap = await getDocs(collection(db, "certifications"));
    return snap.docs.map((d) => d.data());
  } catch (error) {
    console.error("Error getting certifications:", error);
    return [];
  }
};

export const deleteCertificationItem = async (id: string) => {
  if (!db) return false;
  try {
    await deleteDoc(doc(db, "certifications", id));
    return true;
  } catch (error) {
    console.error("Error deleting certification:", error);
    return false;
  }
};

// ================= COLLABORATIONS =================

export const saveCollaboration = async (collab: any) => {
  if (!db) return false;
  try {
    await setDoc(doc(db, "collaborations", collab.id), collab);
    return true;
  } catch (error) {
    console.error("Error saving collaboration:", error);
    return false;
  }
};

export const getAllCollaborations = async () => {
  if (!db) return [];
  try {
    const snap = await getDocs(collection(db, "collaborations"));
    return snap.docs.map((d) => d.data());
  } catch (error) {
    console.error("Error getting collaborations:", error);
    return [];
  }
};

export const deleteCollaborationItem = async (id: string) => {
  if (!db) return false;
  try {
    await deleteDoc(doc(db, "collaborations", id));
    return true;
  } catch (error) {
    console.error("Error deleting collaboration:", error);
    return false;
  }
};

// ================= FILE UPLOAD =================

export const uploadFile = async (
  file: File,
  path: string
): Promise<string | null> => {
  if (!storage) return null;
  try {
    const storageRef = ref(storage, path);
    await uploadBytes(storageRef, file);
    return await getDownloadURL(storageRef);
  } catch (error) {
    console.error("Error uploading file:", error);
    return null;
  }
};

// ================= SETTINGS =================

export const saveSettings = async (settings: any) => {
  if (!db) return false;
  try {
    await setDoc(doc(db, "settings", "app"), settings);
    return true;
  } catch (error) {
    console.error("Error saving settings:", error);
    return false;
  }
};

export const getSettings = async () => {
  if (!db) return null;
  try {
    const snap = await getDoc(doc(db, "settings", "app"));
    return snap.exists() ? snap.data() : null;
  } catch (error) {
    console.error("Error getting settings:", error);
    return null;
  }
};

export { db, storage };
