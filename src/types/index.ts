export interface Skill {
  id: string;
  name: string;
  category: 'Development' | 'Windows' | 'Security' | 'Deployment' | 'Troubleshooting';
  level: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert';
  description: string;
  icon: string;
}

export interface Certification {
  id: string;
  title: string;
  organization: string;
  issueDate: string;
  description: string;
  imageUrl: string;
  pdfUrl?: string;
  verificationUrl?: string;
}

export interface Portfolio {
  id: string;
  title: string;
  description: string;
  images: string[];
  pdfUrl?: string;
  videoUrl?: string;
  tags: string[];
  category: string;
  createdAt: string;
  featured: boolean;
}

export interface CollaborationRequest {
  id: string;
  name: string;
  email: string;
  projectType: string;
  budgetRange: string;
  message: string;
  createdAt: string;
  status: 'pending' | 'reviewed' | 'accepted' | 'declined';
}

export interface Profile {
  name: string;
  title: string;
  bio: string;
  detailedBio: string;
  careerTimeline: TimelineEvent[];
  photoUrl: string;
  galleryPhotos: string[];
  resumeUrl: string;
  email: string;
  social: {
    github?: string;
    linkedin?: string;
    twitter?: string;
  };
  // Stats - Admin will fill these
  stats: {
    yearsExperience: number;
    projectsCompleted: number;
    happyClients: number;
  };
}

export interface TimelineEvent {
  id: string;
  year: string;
  title: string;
  description: string;
  type: 'education' | 'work' | 'achievement';
}
