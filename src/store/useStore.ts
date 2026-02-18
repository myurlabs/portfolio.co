import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Skill, Certification, Portfolio, CollaborationRequest, Profile } from '@/types';

interface EmailConfig {
  serviceId: string;
  templateId: string;
  publicKey: string;
}

interface AppState {
  theme: 'light' | 'dark';
  isAuthenticated: boolean;
  isSetupComplete: boolean;
  adminPassword: string;
  emailConfig: EmailConfig;
  profile: Profile;
  skills: Skill[];
  certifications: Certification[];
  portfolios: Portfolio[];
  collaborationRequests: CollaborationRequest[];

  toggleTheme: () => void;
  login: (password: string) => boolean;
  logout: () => void;
  completeSetup: (password: string) => void;
  updateProfile: (profile: Partial<Profile>) => void;

  addSkill: (skill: Skill) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  deleteSkill: (id: string) => void;

  addCertification: (cert: Certification) => void;
  updateCertification: (id: string, cert: Partial<Certification>) => void;
  deleteCertification: (id: string) => void;

  addPortfolio: (portfolio: Portfolio) => void;
  updatePortfolio: (id: string, portfolio: Partial<Portfolio>) => void;
  deletePortfolio: (id: string) => void;

  addCollaborationRequest: (request: Omit<CollaborationRequest, 'id' | 'createdAt' | 'status'>) => void;
  updateRequestStatus: (id: string, status: CollaborationRequest['status']) => void;

  updateEmailConfig: (config: EmailConfig) => void;

  setAdminPassword: (pwd: string) => void;
  resetStorage: () => void;
}

const defaultProfile: Profile = {
  name: '',
  title: '',
  bio: '',
  detailedBio: '',
  careerTimeline: [],
  photoUrl: '',
  galleryPhotos: [],
  resumeUrl: '',
  email: '',
  social: {
    github: '',
    linkedin: '',
    twitter: '',
  },
  stats: {
    yearsExperience: 0,
    projectsCompleted: 0,
    happyClients: 0,
  },
};

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      theme: 'light',
      isAuthenticated: false,
      isSetupComplete: true,

      // ✅ DEFAULT ADMIN PASSWORD
      adminPassword: 'it0ps@1234=',

      emailConfig: {
        serviceId: '',
        templateId: '',
        publicKey: '',
      },

      profile: defaultProfile,
      skills: [],
      certifications: [],
      portfolios: [],
      collaborationRequests: [],

      toggleTheme: () =>
        set((state) => ({
          theme: state.theme === 'light' ? 'dark' : 'light',
        })),

      // ✅ SAFE LOGIN (trim fix)
      login: (password: string) => {
        const state = get();
        if (password.trim() === state.adminPassword.trim()) {
          set({ isAuthenticated: true });
          return true;
        }
        return false;
      },

      logout: () => set({ isAuthenticated: false }),

      completeSetup: (password: string) =>
        set({
          isSetupComplete: true,
          adminPassword: password.trim(),
          isAuthenticated: true,
        }),

      updateProfile: (profile) =>
        set((state) => ({
          profile: { ...state.profile, ...profile },
        })),

      addSkill: (skill) =>
        set((state) => ({
          skills: [...state.skills, skill],
        })),

      updateSkill: (id, skill) =>
        set((state) => ({
          skills: state.skills.map((s) =>
            s.id === id ? { ...s, ...skill } : s
          ),
        })),

      deleteSkill: (id) =>
        set((state) => ({
          skills: state.skills.filter((s) => s.id !== id),
        })),

      addCertification: (cert) =>
        set((state) => ({
          certifications: [...state.certifications, cert],
        })),

      updateCertification: (id, cert) =>
        set((state) => ({
          certifications: state.certifications.map((c) =>
            c.id === id ? { ...c, ...cert } : c
          ),
        })),

      deleteCertification: (id) =>
        set((state) => ({
          certifications: state.certifications.filter((c) => c.id !== id),
        })),

      addPortfolio: (portfolio) =>
        set((state) => ({
          portfolios: [...state.portfolios, portfolio],
        })),

      updatePortfolio: (id, portfolio) =>
        set((state) => ({
          portfolios: state.portfolios.map((p) =>
            p.id === id ? { ...p, ...portfolio } : p
          ),
        })),

      deletePortfolio: (id) =>
        set((state) => ({
          portfolios: state.portfolios.filter((p) => p.id !== id),
        })),

      addCollaborationRequest: (request) =>
        set((state) => ({
          collaborationRequests: [
            ...state.collaborationRequests,
            {
              ...request,
              id: Date.now().toString(),
              createdAt: new Date().toISOString(),
              status: 'pending',
            },
          ],
        })),

      updateRequestStatus: (id, status) =>
        set((state) => ({
          collaborationRequests: state.collaborationRequests.map((r) =>
            r.id === id ? { ...r, status } : r
          ),
        })),

      updateEmailConfig: (config) => set({ emailConfig: config }),

      setAdminPassword: (pwd: string) =>
        set({ adminPassword: pwd.trim() }),

      // ✅ HARD RESET
      resetStorage: () => {
        localStorage.removeItem('portfolio-storage');
        window.location.reload();
      },
    }),
    {
      name: 'portfolio-storage',
    }
  )
);
