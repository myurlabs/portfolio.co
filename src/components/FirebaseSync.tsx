import { useEffect, useState } from 'react';
import { useStore } from '@/store/useStore';
import {
  isFirebaseConfigured,
  getProfile,
  getAllPortfolio,
  getAllSkills,
  getAllCertifications,
  getAllCollaborations,
  getSettings,
} from '@/lib/firebase';
import type { Skill, Certification, Portfolio, Profile } from '@/types';

interface FirebaseSyncProps {
  children: React.ReactNode;
}

export default function FirebaseSync({ children }: FirebaseSyncProps) {
  const [loading, setLoading] = useState(true);
  
  const { 
    isSetupComplete,
    updateProfile, 
    addSkill, 
    addCertification, 
    addPortfolio,
  } = useStore();

  useEffect(() => {
    const loadFromFirebase = async () => {
      // Check if Firebase is configured
      if (!isFirebaseConfigured()) {
        console.log('Firebase not configured, using localStorage');
        setLoading(false);
        return;
      }
      console.log('Firebase configured, loading data...');

      try {
        // Load settings (including setup status)
        const settings = await getSettings();
        if (settings?.isSetupComplete) {
          // Load profile
          const profile = await getProfile();
          if (profile) {
            updateProfile(profile as Partial<Profile>);
          }

          // Load portfolios
          const portfolios = await getAllPortfolio();
          portfolios.forEach((p) => {
            addPortfolio(p as Portfolio);
          });

          // Load skills
          const skills = await getAllSkills();
          skills.forEach((s) => {
            addSkill(s as Skill);
          });

          // Load certifications
          const certs = await getAllCertifications();
          certs.forEach((c) => {
            addCertification(c as Certification);
          });

          // Load collaboration requests
          const collabs = await getAllCollaborations();
          console.log('Loaded collaborations:', collabs.length);
        }
      } catch (error) {
        console.error('Error loading from Firebase:', error);
      }

      setLoading(false);
    };

    // Only load from Firebase if not already set up locally
    if (!isSetupComplete) {
      loadFromFirebase();
    } else {
      setLoading(false);
    }
  }, [isSetupComplete, updateProfile, addSkill, addCertification, addPortfolio]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
          <p className="text-gray-600 dark:text-gray-400">Loading portfolio...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

// Hook to sync data to Firebase when it changes
export function useFirebaseSync() {
  const syncToFirebase = async () => {
    if (!isFirebaseConfigured()) return;
    
    // This will be called when admin makes changes
    // Individual save functions are called from admin actions
  };

  return { syncToFirebase, isFirebaseEnabled: isFirebaseConfigured() };
}
