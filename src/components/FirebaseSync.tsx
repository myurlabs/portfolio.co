import { useEffect, useState } from "react";
import { useStore } from "@/store/useStore";
import {
  isFirebaseConfigured,
  getProfile,
  getAllPortfolio,
  getAllSkills,
  getAllCertifications,
  getAllCollaborations,
  getSettings,
  saveFullStore,
} from "@/lib/firebase";
import type { Skill, Certification, Portfolio, Profile } from "@/types";

interface FirebaseSyncProps {
  children: React.ReactNode;
}

export default function FirebaseSync({ children }: FirebaseSyncProps) {
  const [loading, setLoading] = useState(true);

  const store = useStore();

  const {
    isSetupComplete,
    updateProfile,
    addSkill,
    addCertification,
    addPortfolio,
  } = store;

  // 🔥 LOAD from Firebase
  useEffect(() => {
    const loadFromFirebase = async () => {
      if (!isFirebaseConfigured()) {
        console.log("Firebase not configured, using localStorage");
        setLoading(false);
        return;
      }

      console.log("Loading from Firebase...");

      try {
        const settings = await getSettings();

        if (settings?.isSetupComplete) {
          const profile = await getProfile();
          if (profile) {
            updateProfile(profile as Partial<Profile>);
          }

          const portfolios = await getAllPortfolio();
          portfolios.forEach((p) => addPortfolio(p as Portfolio));

          const skills = await getAllSkills();
          skills.forEach((s) => addSkill(s as Skill));

          const certs = await getAllCertifications();
          certs.forEach((c) => addCertification(c as Certification));

          const collabs = await getAllCollaborations();
          console.log("Loaded collaborations:", collabs.length);
        }
      } catch (err) {
        console.error("Firebase load error:", err);
      }

      setLoading(false);
    };

    loadFromFirebase();
  }, []);

  // 🔥 AUTO SAVE to Firebase when store changes
  useEffect(() => {
    if (!isFirebaseConfigured()) return;

    const unsub = useStore.subscribe(async (state) => {
      try {
        await saveFullStore(state);
        console.log("Auto-synced to Firebase");
      } catch (err) {
        console.error("Firebase save error:", err);
      }
    });

    return () => unsub();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">
            Syncing portfolio...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
