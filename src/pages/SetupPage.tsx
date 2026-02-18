import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  User, Briefcase, Award, Lock, ArrowRight, ArrowLeft, 
  Check, Github, Linkedin, Twitter, Plus, Trash2,
  Sparkles
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/utils/cn';
import ImageUpload from '@/components/ImageUpload';
import type { Skill, Portfolio, TimelineEvent } from '@/types';

const steps = [
  { id: 1, title: 'Basic Info', icon: User, description: 'Apna naam aur title daalein' },
  { id: 2, title: 'About You', icon: Briefcase, description: 'Apne baare mein batayein' },
  { id: 3, title: 'Stats', icon: Award, description: 'Apne experience stats daalein' },
  { id: 4, title: 'Skills', icon: Award, description: 'Apni skills add karein' },
  { id: 5, title: 'Portfolio', icon: Briefcase, description: 'Apne projects add karein' },
  { id: 6, title: 'Security', icon: Lock, description: 'Admin password set karein' },
];

const skillCategories = ['Development', 'Windows', 'Security', 'Deployment', 'Troubleshooting'] as const;
const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'] as const;

export function SetupPage() {
  const navigate = useNavigate();
  const { theme, isSetupComplete, updateProfile, addSkill, addPortfolio, completeSetup } = useStore();
  
  const [currentStep, setCurrentStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Step 1: Basic Info
  const [name, setName] = useState('');
  const [title, setTitle] = useState('');
  const [email, setEmail] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [twitter, setTwitter] = useState('');
  
  // Step 2: About
  const [bio, setBio] = useState('');
  
  // Step 3: Stats
  const [yearsExperience, setYearsExperience] = useState(0);
  const [projectsCompleted, setProjectsCompleted] = useState(0);
  const [happyClients, setHappyClients] = useState(0);
  const [detailedBio, setDetailedBio] = useState('');
  const [timeline, setTimeline] = useState<TimelineEvent[]>([]);
  
  // Step 3: Skills
  const [skills, setSkills] = useState<Skill[]>([]);
  const [newSkill, setNewSkill] = useState<Partial<Skill>>({
    name: '', category: 'Development', level: 'Intermediate', description: '', icon: 'Code2'
  });
  
  // Step 4: Portfolio
  const [portfolios, setPortfolios] = useState<Portfolio[]>([]);
  const [newPortfolio, setNewPortfolio] = useState<Partial<Portfolio>>({
    title: '', description: '', images: [''], tags: [], category: '', featured: false
  });
  const [tagsInput, setTagsInput] = useState('');
  
  // Step 6: Password
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // If setup is already complete, redirect to home
  if (isSetupComplete) {
    return <Navigate to="/" />;
  }

  const addTimelineEvent = () => {
    setTimeline([...timeline, {
      id: Date.now().toString(),
      year: new Date().getFullYear().toString(),
      title: '',
      description: '',
      type: 'work'
    }]);
  };

  const updateTimelineEvent = (id: string, field: keyof TimelineEvent, value: string) => {
    setTimeline(timeline.map(t => t.id === id ? { ...t, [field]: value } : t));
  };

  const removeTimelineEvent = (id: string) => {
    setTimeline(timeline.filter(t => t.id !== id));
  };

  const handleAddSkill = () => {
    if (newSkill.name) {
      const skill: Skill = {
        id: Date.now().toString(),
        name: newSkill.name,
        category: newSkill.category as Skill['category'],
        level: newSkill.level as Skill['level'],
        description: newSkill.description || '',
        icon: newSkill.icon || 'Code2',
      };
      setSkills([...skills, skill]);
      setNewSkill({ name: '', category: 'Development', level: 'Intermediate', description: '', icon: 'Code2' });
    }
  };

  const handleAddPortfolio = () => {
    if (newPortfolio.title) {
      const portfolio: Portfolio = {
        id: Date.now().toString(),
        title: newPortfolio.title || '',
        description: newPortfolio.description || '',
        images: newPortfolio.images?.filter(Boolean) || [],
        tags: tagsInput.split(',').map(t => t.trim()).filter(Boolean),
        category: newPortfolio.category || '',
        createdAt: new Date().toISOString(),
        featured: newPortfolio.featured || false,
      };
      setPortfolios([...portfolios, portfolio]);
      setNewPortfolio({ title: '', description: '', images: [''], tags: [], category: '', featured: false });
      setTagsInput('');
    }
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return name.trim() && title.trim() && email.trim();
      case 2:
        return bio.trim();
      case 3:
        return true; // Stats are optional
      case 4:
        return true; // Skills are optional
      case 5:
        return true; // Portfolio is optional
      case 6:
        return password.length >= 6 && password === confirmPassword;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (currentStep < 6) {
      setCurrentStep(currentStep + 1);
    } else {
      handleSubmit();
    }
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    
    // Save profile
    updateProfile({
      name,
      title,
      email,
      photoUrl: photoUrl || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&h=400&fit=crop&crop=face',
      bio,
      detailedBio,
      careerTimeline: timeline,
      social: { github, linkedin, twitter },
      galleryPhotos: [],
      resumeUrl: '',
      stats: {
        yearsExperience,
        projectsCompleted,
        happyClients,
      },
    });
    
    // Add skills
    skills.forEach(skill => addSkill(skill));
    
    // Add portfolios
    portfolios.forEach(portfolio => addPortfolio(portfolio));
    
    // Complete setup with password
    completeSetup(password);
    
    // Redirect to admin
    setTimeout(() => {
      navigate('/admin');
    }, 1000);
  };

  const inputClasses = cn(
    'w-full px-4 py-3 rounded-xl border-2 transition-all duration-200 focus:outline-none focus:ring-0',
    theme === 'dark'
      ? 'bg-gray-800 border-gray-700 text-white placeholder-gray-500 focus:border-indigo-500'
      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-500'
  );

  const labelClasses = cn(
    'block text-sm font-medium mb-2',
    theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
  );

  return (
    <div className={cn(
      'min-h-screen py-8',
      theme === 'dark' ? 'bg-gray-900' : 'bg-gray-50'
    )}>
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-3xl font-bold mb-2">Portfolio Setup Wizard</h1>
          <p className={cn(
            'text-lg',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            Apni portfolio website setup karein - Step {currentStep} of 6
          </p>
        </motion.div>

        {/* Progress Steps */}
        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-2">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <button
                  onClick={() => currentStep > step.id && setCurrentStep(step.id)}
                  disabled={currentStep < step.id}
                  className={cn(
                    'w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all',
                    currentStep === step.id
                      ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                      : currentStep > step.id
                        ? 'bg-green-500 text-white cursor-pointer'
                        : theme === 'dark'
                          ? 'bg-gray-700 text-gray-400'
                          : 'bg-gray-200 text-gray-500'
                  )}
                >
                  {currentStep > step.id ? <Check className="w-5 h-5" /> : step.id}
                </button>
                {index < steps.length - 1 && (
                  <div className={cn(
                    'w-8 h-1 mx-1 rounded',
                    currentStep > step.id
                      ? 'bg-green-500'
                      : theme === 'dark'
                        ? 'bg-gray-700'
                        : 'bg-gray-200'
                  )} />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          className={cn(
            'p-8 rounded-2xl',
            theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-xl'
          )}
        >
          <div className="flex items-center mb-6">
            {(() => {
              const StepIcon = steps[currentStep - 1].icon;
              return <StepIcon className="w-6 h-6 text-indigo-500 mr-3" />;
            })()}
            <div>
              <h2 className="text-xl font-semibold">{steps[currentStep - 1].title}</h2>
              <p className={cn('text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                {steps[currentStep - 1].description}
              </p>
            </div>
          </div>

          {/* Step 1: Basic Info */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className={labelClasses}>
                    <User className="w-4 h-4 inline mr-2" />
                    Aapka Naam *
                  </label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="e.g., Ahmed Khan"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className={labelClasses}>
                    <Briefcase className="w-4 h-4 inline mr-2" />
                    Professional Title *
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g., Software Developer & Windows Expert"
                    className={inputClasses}
                  />
                </div>
                <div>
                  <label className={labelClasses}>
                    Email Address *
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="e.g., your@email.com"
                    className={inputClasses}
                  />
                </div>
                <div className="sm:col-span-2 flex justify-center">
                  <ImageUpload
                    currentImage={photoUrl}
                    onImageUpload={(url) => setPhotoUrl(url)}
                    label="Profile Photo Upload Karein"
                    shape="circle"
                  />
                </div>
              </div>
              
              <div className={cn('p-4 rounded-xl', theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100')}>
                <p className={cn('text-sm font-medium mb-3', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
                  Social Links (Optional)
                </p>
                <div className="grid sm:grid-cols-3 gap-3">
                  <div className="flex items-center">
                    <Github className="w-5 h-5 mr-2 text-gray-500" />
                    <input
                      type="text"
                      value={github}
                      onChange={(e) => setGithub(e.target.value)}
                      placeholder="GitHub URL"
                      className={cn(inputClasses, 'py-2')}
                    />
                  </div>
                  <div className="flex items-center">
                    <Linkedin className="w-5 h-5 mr-2 text-gray-500" />
                    <input
                      type="text"
                      value={linkedin}
                      onChange={(e) => setLinkedin(e.target.value)}
                      placeholder="LinkedIn URL"
                      className={cn(inputClasses, 'py-2')}
                    />
                  </div>
                  <div className="flex items-center">
                    <Twitter className="w-5 h-5 mr-2 text-gray-500" />
                    <input
                      type="text"
                      value={twitter}
                      onChange={(e) => setTwitter(e.target.value)}
                      placeholder="Twitter URL"
                      className={cn(inputClasses, 'py-2')}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Step 2: About */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <label className={labelClasses}>Short Bio (Homepage ke liye) *</label>
                <textarea
                  value={bio}
                  onChange={(e) => setBio(e.target.value)}
                  placeholder="Apne baare mein 1-2 sentences mein batayein..."
                  className={inputClasses}
                  rows={3}
                />
              </div>
              
              <div>
                <label className={labelClasses}>Detailed Bio (About page ke liye)</label>
                <textarea
                  value={detailedBio}
                  onChange={(e) => setDetailedBio(e.target.value)}
                  placeholder="Apni puri kahani batayein - education, experience, passion sab..."
                  className={inputClasses}
                  rows={6}
                />
              </div>

              <div className={cn('p-4 rounded-xl', theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100')}>
                <div className="flex items-center justify-between mb-3">
                  <p className={cn('text-sm font-medium', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
                    Career Timeline (Optional)
                  </p>
                  <button
                    onClick={addTimelineEvent}
                    className="flex items-center text-sm text-indigo-500 hover:text-indigo-600"
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Event
                  </button>
                </div>
                
                <div className="space-y-3">
                  {timeline.map((event) => (
                    <div key={event.id} className="flex gap-2">
                      <input
                        type="text"
                        value={event.year}
                        onChange={(e) => updateTimelineEvent(event.id, 'year', e.target.value)}
                        placeholder="Year"
                        className={cn(inputClasses, 'w-20 py-2')}
                      />
                      <input
                        type="text"
                        value={event.title}
                        onChange={(e) => updateTimelineEvent(event.id, 'title', e.target.value)}
                        placeholder="Title"
                        className={cn(inputClasses, 'flex-1 py-2')}
                      />
                      <select
                        value={event.type}
                        onChange={(e) => updateTimelineEvent(event.id, 'type', e.target.value)}
                        className={cn(inputClasses, 'w-32 py-2')}
                      >
                        <option value="work">Work</option>
                        <option value="education">Education</option>
                        <option value="achievement">Achievement</option>
                      </select>
                      <button
                        onClick={() => removeTimelineEvent(event.id)}
                        className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Step 3: Stats */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div className={cn(
                'p-4 rounded-xl text-center',
                theme === 'dark' ? 'bg-amber-500/20' : 'bg-amber-50'
              )}>
                <Award className="w-12 h-12 text-amber-500 mx-auto mb-3" />
                <p className={cn('font-medium', theme === 'dark' ? 'text-amber-300' : 'text-amber-700')}>
                  Apne Professional Stats Daalein
                </p>
                <p className={cn('text-sm', theme === 'dark' ? 'text-amber-400' : 'text-amber-600')}>
                  Yeh About page pe Career Journey section mein dikhenge
                </p>
              </div>

              <div className="grid sm:grid-cols-3 gap-4">
                <div>
                  <label className={labelClasses}>
                    Years of Experience
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={yearsExperience}
                    onChange={(e) => setYearsExperience(parseInt(e.target.value) || 0)}
                    placeholder="e.g., 5"
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className={labelClasses}>
                    Projects Completed
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={projectsCompleted}
                    onChange={(e) => setProjectsCompleted(parseInt(e.target.value) || 0)}
                    placeholder="e.g., 25"
                    className={inputClasses}
                  />
                </div>

                <div>
                  <label className={labelClasses}>
                    Happy Clients
                  </label>
                  <input
                    type="number"
                    min="0"
                    value={happyClients}
                    onChange={(e) => setHappyClients(parseInt(e.target.value) || 0)}
                    placeholder="e.g., 15"
                    className={inputClasses}
                  />
                </div>
              </div>

              <p className={cn('text-sm italic', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
                💡 Tip: Agar 0 rehne doge toh woh stat show nahi hoga. Certifications count automatically aa jayega.
              </p>
            </div>
          )}

          {/* Step 4: Skills */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div className={cn('p-4 rounded-xl', theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100')}>
                <p className={cn('text-sm font-medium mb-3', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
                  Nayi Skill Add Karein
                </p>
                <div className="grid sm:grid-cols-2 gap-3 mb-3">
                  <input
                    type="text"
                    value={newSkill.name}
                    onChange={(e) => setNewSkill({ ...newSkill, name: e.target.value })}
                    placeholder="Skill Name (e.g., React.js)"
                    className={cn(inputClasses, 'py-2')}
                  />
                  <select
                    value={newSkill.category}
                    onChange={(e) => setNewSkill({ ...newSkill, category: e.target.value as Skill['category'] })}
                    className={cn(inputClasses, 'py-2')}
                  >
                    {skillCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                  <select
                    value={newSkill.level}
                    onChange={(e) => setNewSkill({ ...newSkill, level: e.target.value as Skill['level'] })}
                    className={cn(inputClasses, 'py-2')}
                  >
                    {skillLevels.map(level => <option key={level} value={level}>{level}</option>)}
                  </select>
                  <input
                    type="text"
                    value={newSkill.description}
                    onChange={(e) => setNewSkill({ ...newSkill, description: e.target.value })}
                    placeholder="Short description"
                    className={cn(inputClasses, 'py-2')}
                  />
                </div>
                <button
                  onClick={handleAddSkill}
                  disabled={!newSkill.name}
                  className={cn(
                    'flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white',
                    newSkill.name ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-gray-400 cursor-not-allowed'
                  )}
                >
                  <Plus className="w-4 h-4 mr-1" /> Add Skill
                </button>
              </div>

              {/* Added Skills */}
              {skills.length > 0 && (
                <div>
                  <p className={cn('text-sm font-medium mb-3', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
                    Added Skills ({skills.length})
                  </p>
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {skills.map((skill) => (
                      <div 
                        key={skill.id} 
                        className={cn(
                          'p-3 rounded-xl flex items-center justify-between',
                          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                        )}
                      >
                        <div>
                          <p className="font-medium text-sm">{skill.name}</p>
                          <p className={cn('text-xs', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
                            {skill.category} • {skill.level}
                          </p>
                        </div>
                        <button
                          onClick={() => setSkills(skills.filter(s => s.id !== skill.id))}
                          className="p-1 text-red-500 hover:bg-red-500/10 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className={cn('text-sm italic', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
                💡 Tip: Aap baad mein Admin Dashboard se bhi skills add kar sakte hain
              </p>
            </div>
          )}

          {/* Step 5: Portfolio */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <div className={cn('p-4 rounded-xl', theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100')}>
                <p className={cn('text-sm font-medium mb-3', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
                  Naya Project Add Karein
                </p>
                <div className="grid sm:grid-cols-2 gap-3 mb-3">
                  <input
                    type="text"
                    value={newPortfolio.title}
                    onChange={(e) => setNewPortfolio({ ...newPortfolio, title: e.target.value })}
                    placeholder="Project Title"
                    className={cn(inputClasses, 'py-2')}
                  />
                  <input
                    type="text"
                    value={newPortfolio.category}
                    onChange={(e) => setNewPortfolio({ ...newPortfolio, category: e.target.value })}
                    placeholder="Category (e.g., Web Development)"
                    className={cn(inputClasses, 'py-2')}
                  />
                </div>
                <textarea
                  value={newPortfolio.description}
                  onChange={(e) => setNewPortfolio({ ...newPortfolio, description: e.target.value })}
                  placeholder="Project Description"
                  className={cn(inputClasses, 'py-2 mb-3')}
                  rows={2}
                />
                <div className="mb-3">
                  <ImageUpload
                    currentImage={newPortfolio.images?.[0] || ''}
                    onImageUpload={(url) => setNewPortfolio({ ...newPortfolio, images: [url] })}
                    label="Project Image Upload Karein"
                    shape="square"
                  />
                </div>
                <div className="mb-3">
                  <input
                    type="text"
                    value={tagsInput}
                    onChange={(e) => setTagsInput(e.target.value)}
                    placeholder="Tags (comma separated)"
                    className={cn(inputClasses, 'py-2')}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={newPortfolio.featured}
                      onChange={(e) => setNewPortfolio({ ...newPortfolio, featured: e.target.checked })}
                      className="mr-2"
                    />
                    Featured Project
                  </label>
                  <button
                    onClick={handleAddPortfolio}
                    disabled={!newPortfolio.title}
                    className={cn(
                      'flex items-center px-4 py-2 rounded-lg text-sm font-medium text-white',
                      newPortfolio.title ? 'bg-indigo-500 hover:bg-indigo-600' : 'bg-gray-400 cursor-not-allowed'
                    )}
                  >
                    <Plus className="w-4 h-4 mr-1" /> Add Project
                  </button>
                </div>
              </div>

              {/* Added Portfolios */}
              {portfolios.length > 0 && (
                <div>
                  <p className={cn('text-sm font-medium mb-3', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
                    Added Projects ({portfolios.length})
                  </p>
                  <div className="space-y-2">
                    {portfolios.map((project) => (
                      <div 
                        key={project.id} 
                        className={cn(
                          'p-3 rounded-xl flex items-center justify-between',
                          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-100'
                        )}
                      >
                        <div>
                          <p className="font-medium text-sm">{project.title}</p>
                          <p className={cn('text-xs', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
                            {project.category} {project.featured && '⭐ Featured'}
                          </p>
                        </div>
                        <button
                          onClick={() => setPortfolios(portfolios.filter(p => p.id !== project.id))}
                          className="p-1 text-red-500 hover:bg-red-500/10 rounded"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <p className={cn('text-sm italic', theme === 'dark' ? 'text-gray-500' : 'text-gray-400')}>
                💡 Tip: Aap baad mein Admin Dashboard se bhi projects add kar sakte hain
              </p>
            </div>
          )}

          {/* Step 6: Security */}
          {currentStep === 6 && (
            <div className="space-y-4">
              <div className={cn(
                'p-4 rounded-xl text-center',
                theme === 'dark' ? 'bg-indigo-500/20' : 'bg-indigo-50'
              )}>
                <Lock className="w-12 h-12 text-indigo-500 mx-auto mb-3" />
                <p className={cn('font-medium', theme === 'dark' ? 'text-indigo-300' : 'text-indigo-700')}>
                  Ek strong admin password set karein
                </p>
                <p className={cn('text-sm', theme === 'dark' ? 'text-indigo-400' : 'text-indigo-600')}>
                  Yeh password Admin Dashboard access karne ke liye use hoga
                </p>
              </div>

              <div>
                <label className={labelClasses}>Admin Password *</label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Minimum 6 characters"
                  className={inputClasses}
                />
              </div>

              <div>
                <label className={labelClasses}>Confirm Password *</label>
                <input
                  type="password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Password dobara likhein"
                  className={cn(
                    inputClasses,
                    confirmPassword && password !== confirmPassword && 'border-red-500'
                  )}
                />
                {confirmPassword && password !== confirmPassword && (
                  <p className="text-red-500 text-sm mt-1">Passwords match nahi kar rahe</p>
                )}
              </div>

              {password.length > 0 && password.length < 6 && (
                <p className="text-amber-500 text-sm">Password kam se kam 6 characters ka hona chahiye</p>
              )}
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between mt-8 pt-6 border-t border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setCurrentStep(currentStep - 1)}
              disabled={currentStep === 1}
              className={cn(
                'flex items-center px-4 py-2 rounded-xl font-medium transition-colors',
                currentStep === 1
                  ? 'text-gray-400 cursor-not-allowed'
                  : theme === 'dark'
                    ? 'text-gray-300 hover:bg-gray-700'
                    : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </button>

            <button
              onClick={handleNext}
              disabled={!canProceed() || isSubmitting}
              className={cn(
                'flex items-center px-6 py-3 rounded-xl font-medium text-white transition-all',
                !canProceed() || isSubmitting
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/25'
              )}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Setting up...
                </>
              ) : currentStep === 6 ? (
                <>
                  <Check className="w-5 h-5 mr-2" />
                  Complete Setup
                </>
              ) : (
                <>
                  Next
                  <ArrowRight className="w-5 h-5 ml-2" />
                </>
              )}
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
