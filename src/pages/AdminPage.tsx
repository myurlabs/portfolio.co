import { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Briefcase, Code2, Award, MessageSquare, User, LogOut,
  Plus, Trash2, Check, X, Download, Upload, Database, Copy, Eye, Mail, Lock
} from 'lucide-react';
import { saveAs } from 'file-saver';
import { useStore } from '@/store/useStore';
import { cn } from '@/utils/cn';
import ImageUpload from '@/components/ImageUpload';
import PasswordGate from '@/components/PasswordGate';
import type { Skill, Certification, Portfolio } from '@/types';

type Tab = 'portfolio' | 'skills' | 'certifications' | 'requests' | 'profile' | 'email' | 'data';

const skillCategories = ['Development', 'Windows', 'Security', 'Deployment', 'Troubleshooting'] as const;
const skillLevels = ['Beginner', 'Intermediate', 'Advanced', 'Expert'] as const;

export function AdminPage() {
  const {
    theme, isAuthenticated, logout, profile, skills, certifications, portfolios, collaborationRequests,
    addSkill, deleteSkill,
    addCertification, deleteCertification,
    addPortfolio, deletePortfolio,
    updateRequestStatus, updateProfile,
    emailConfig, updateEmailConfig,
    adminPassword
  } = useStore();

  // Lock the whole admin page behind a small password gate component
  const [locked, setLocked] = useState(true);

  const [activeTab, setActiveTab] = useState<Tab>('portfolio');
  const [showAddForm, setShowAddForm] = useState(false);
  const [emailAccessGranted, setEmailAccessGranted] = useState(false);
  const [emailPassword, setEmailPassword] = useState('');
  const [emailPasswordError, setEmailPasswordError] = useState('');
  const [isPasswordPromptOpen, setIsPasswordPromptOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<null | (() => void)>(null);
  const [actionPassword, setActionPassword] = useState('');
  const [actionError, setActionError] = useState('');

  const handleEmailAccess = () => {
    if (emailPassword === adminPassword) {
      setEmailAccessGranted(true);
      setEmailPassword('');
      setEmailPasswordError('');
    } else {
      setEmailPasswordError('Invalid password. Please try again.');
    }
  };

  const requestAdminPassword = (action: () => void) => {
    setPendingAction(() => action);
    setActionPassword('');
    setActionError('');
    setIsPasswordPromptOpen(true);
  };

  const handleConfirmAction = () => {
    if (actionPassword === adminPassword) {
      const action = pendingAction;
      setIsPasswordPromptOpen(false);
      setPendingAction(null);
      setActionPassword('');
      setActionError('');
      action?.();
    } else {
      setActionError('Invalid admin password. Please try again.');
    }
  };

  const handleCancelAction = () => {
    setIsPasswordPromptOpen(false);
    setPendingAction(null);
    setActionPassword('');
    setActionError('');
  };

  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }

  // If locked, show the PasswordGate component (it will call onSuccess when unlocked)
  if (locked) {
    return <PasswordGate onSuccess={() => setLocked(false)} />;
  }

  const tabs = [
    { id: 'portfolio' as Tab, label: 'Portfolio', icon: Briefcase, count: portfolios.length },
    { id: 'skills' as Tab, label: 'Skills', icon: Code2, count: skills.length },
    { id: 'certifications' as Tab, label: 'Certifications', icon: Award, count: certifications.length },
    { id: 'requests' as Tab, label: 'Requests', icon: MessageSquare, count: collaborationRequests.filter(r => r.status === 'pending').length },
    { id: 'profile' as Tab, label: 'Profile', icon: User, count: null },
    { id: 'email' as Tab, label: 'Email Settings', icon: Mail, count: null },
    { id: 'data' as Tab, label: 'Export/Import', icon: Database, count: null },
  ];

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <motion.h1
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl font-bold"
          >
            Admin Dashboard
          </motion.h1>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setLocked(true)}
              title="Lock dashboard"
              className={cn(
                'flex items-center px-3 py-2 rounded-xl text-sm font-medium transition-colors',
                theme === 'dark'
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              <Lock className="w-4 h-4 mr-2" />
              Lock
            </button>

            <button
              onClick={logout}
              className={cn(
                'flex items-center px-4 py-2 rounded-xl text-sm font-medium transition-colors',
                theme === 'dark'
                  ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </button>
          </div>
        </div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'flex flex-wrap gap-2 p-2 rounded-2xl mb-8',
            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
          )}
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setShowAddForm(false); }}
              className={cn(
                'flex items-center px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200',
                activeTab === tab.id
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                  : theme === 'dark'
                    ? 'text-gray-400 hover:text-white hover:bg-gray-700'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-white'
              )}
            >
              <tab.icon className="w-4 h-4 mr-2" />
              {tab.label}
              {tab.count !== null && (
                <span className={cn(
                  'ml-2 px-2 py-0.5 rounded-full text-xs',
                  activeTab === tab.id
                    ? 'bg-white/20'
                    : theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                )}>
                  {tab.count}
                </span>
              )}
            </button>
          ))}
        </motion.div>

        {/* Content */}
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className={cn(
            'rounded-2xl p-6',
            theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-lg'
          )}
        >
          {/* Portfolio Tab */}
          {activeTab === 'portfolio' && (
            <PortfolioManager 
              theme={theme}
              portfolios={portfolios}
              addPortfolio={addPortfolio}
              deletePortfolio={deletePortfolio}
              showAddForm={showAddForm}
              setShowAddForm={setShowAddForm}
              onRequirePassword={requestAdminPassword}
            />
          )}

          {/* Skills Tab */}
          {activeTab === 'skills' && (
            <SkillsManager
              theme={theme}
              skills={skills}
              addSkill={addSkill}
              deleteSkill={deleteSkill}
              showAddForm={showAddForm}
              setShowAddForm={setShowAddForm}
              onRequirePassword={requestAdminPassword}
            />
          )}

          {/* Certifications Tab */}
          {activeTab === 'certifications' && (
            <CertificationsManager
              theme={theme}
              certifications={certifications}
              addCertification={addCertification}
              deleteCertification={deleteCertification}
              showAddForm={showAddForm}
              setShowAddForm={setShowAddForm}
              onRequirePassword={requestAdminPassword}
            />
          )}

          {/* Requests Tab */}
          {activeTab === 'requests' && (
            <RequestsManager
              theme={theme}
              requests={collaborationRequests}
              updateStatus={updateRequestStatus}
              onRequirePassword={requestAdminPassword}
            />
          )}

          {/* Profile Tab */}
          {activeTab === 'profile' && (
            <ProfileManager
              theme={theme}
              profile={profile}
              updateProfile={updateProfile}
              onRequirePassword={requestAdminPassword}
            />
          )}

          {/* Email Settings Tab */}
          {activeTab === 'email' && (
            emailAccessGranted ? (
              <EmailSettingsManager
                theme={theme}
                emailConfig={emailConfig}
                updateEmailConfig={updateEmailConfig}
                onRequirePassword={requestAdminPassword}
              />
            ) : (
              <div className={cn('p-6 rounded-2xl border-2 border-dashed text-center', theme === 'dark' ? 'border-gray-600 bg-gray-800/50' : 'border-gray-300 bg-gray-50')}>
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
                  <Lock className="w-8 h-8 text-white" />
                </div>
                <h3 className="text-xl font-semibold mb-2">Email Settings Locked</h3>
                <p className={cn('text-sm mb-6', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                  EmailJS settings access karne ke liye admin password dobara confirm karein
                </p>
                <div className="max-w-sm mx-auto">
                  <input
                    type="password"
                    value={emailPassword}
                    onChange={(e) => setEmailPassword(e.target.value)}
                    placeholder="Enter admin password"
                    className={cn(
                      'w-full px-4 py-3 rounded-xl border-2 transition-all mb-3',
                      theme === 'dark'
                        ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-500'
                        : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-500'
                    )}
                  />
                  {emailPasswordError && (
                    <p className="text-red-500 text-sm mb-3">{emailPasswordError}</p>
                  )}
                  <button
                    onClick={handleEmailAccess}
                    className="w-full px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:shadow-lg transition-all"
                  >
                    Unlock Email Settings
                  </button>
                </div>
              </div>
            )
          )}

          {/* Data Export/Import Tab */}
          {activeTab === 'data' && (
            <DataManager theme={theme} onRequirePassword={requestAdminPassword} />
          )}
        </motion.div>

        {/* Password Confirmation Modal */}
        {isPasswordPromptOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
            <div className={cn('w-full max-w-md rounded-2xl p-6', theme === 'dark' ? 'bg-gray-800' : 'bg-white')}>
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center">
                  <Lock className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold">Confirm Admin Password</h3>
                  <p className={cn('text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                    Changes save karne ke liye admin password required hai
                  </p>
                </div>
              </div>

              <input
                type="password"
                value={actionPassword}
                onChange={(e) => setActionPassword(e.target.value)}
                placeholder="Enter admin password"
                className={cn(
                  'w-full px-4 py-3 rounded-xl border-2 transition-all mb-3',
                  theme === 'dark'
                    ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-500'
                    : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-500'
                )}
              />
              {actionError && (
                <p className="text-red-500 text-sm mb-3">{actionError}</p>
              )}

              <div className="flex gap-3">
                <button
                  onClick={handleCancelAction}
                  className={cn(
                    'flex-1 px-4 py-3 rounded-xl font-medium',
                    theme === 'dark' ? 'bg-gray-700 text-gray-200' : 'bg-gray-100 text-gray-700'
                  )}
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmAction}
                  className="flex-1 px-4 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

// Portfolio Manager Component
function PortfolioManager({ theme, portfolios, addPortfolio, deletePortfolio, showAddForm, setShowAddForm, onRequirePassword }: any) {
  const [formData, setFormData] = useState<Partial<Portfolio>>({
    title: '', description: '', images: [''], tags: [], category: '', featured: false
  });

  const handleAdd = () => {
    onRequirePassword(() => {
      const newPortfolio: Portfolio = {
        id: Date.now().toString(),
        title: formData.title || '',
        description: formData.description || '',
        images: formData.images?.filter(Boolean) || [],
        tags: formData.tags || [],
        category: formData.category || '',
        createdAt: new Date().toISOString(),
        featured: formData.featured || false,
      };
      addPortfolio(newPortfolio);
      setShowAddForm(false);
      setFormData({ title: '', description: '', images: [''], tags: [], category: '', featured: false });
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Manage Portfolio</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </button>
      </div>

      {showAddForm && (
        <div className={cn('p-4 rounded-xl mb-6', theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50')}>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Project Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={cn('px-4 py-2 rounded-lg', theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-white')}
            />
            <input
              type="text"
              placeholder="Category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className={cn('px-4 py-2 rounded-lg', theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-white')}
            />
          </div>
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={cn('w-full px-4 py-2 rounded-lg mb-4', theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-white')}
            rows={3}
          />
          <div className="mb-4">
            <ImageUpload
              currentImage={formData.images?.[0] || ''}
              onImageUpload={(url) => setFormData({ ...formData, images: [url] })}
              label="Project Image"
              shape="square"
            />
          </div>
          <input
            type="text"
            placeholder="Tags (comma separated)"
            onChange={(e) => setFormData({ ...formData, tags: e.target.value.split(',').map(t => t.trim()) })}
            className={cn('w-full px-4 py-2 rounded-lg mb-4', theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-white')}
          />
          <div className="flex items-center gap-4">
            <label className="flex items-center">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                className="mr-2"
              />
              Featured
            </label>
            <button onClick={handleAdd} className="px-4 py-2 rounded-lg bg-green-500 text-white text-sm">
              <Check className="w-4 h-4 inline mr-1" /> Save
            </button>
            <button onClick={() => setShowAddForm(false)} className="px-4 py-2 rounded-lg bg-gray-500 text-white text-sm">
              <X className="w-4 h-4 inline mr-1" /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {portfolios.map((project: Portfolio) => (
          <div key={project.id} className={cn('flex items-center p-4 rounded-xl', theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50')}>
            <img src={project.images[0]} alt={project.title} className="w-16 h-16 rounded-lg object-cover mr-4" />
            <div className="flex-1">
              <h3 className="font-semibold">{project.title}</h3>
              <p className={cn('text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>{project.category}</p>
            </div>
            {project.featured && <span className="px-2 py-1 text-xs bg-amber-500 text-white rounded mr-2">Featured</span>}
            <button
              onClick={() => onRequirePassword(() => deletePortfolio(project.id))}
              className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Skills Manager Component
function SkillsManager({ theme, skills, addSkill, deleteSkill, showAddForm, setShowAddForm, onRequirePassword }: any) {
  const [formData, setFormData] = useState<Partial<Skill>>({
    name: '', category: 'Development', level: 'Intermediate', description: '', icon: 'Code2'
  });

  const handleAdd = () => {
    onRequirePassword(() => {
      const newSkill: Skill = {
        id: Date.now().toString(),
        name: formData.name || '',
        category: formData.category as Skill['category'] || 'Development',
        level: formData.level as Skill['level'] || 'Intermediate',
        description: formData.description || '',
        icon: formData.icon || 'Code2',
      };
      addSkill(newSkill);
      setShowAddForm(false);
      setFormData({ name: '', category: 'Development', level: 'Intermediate', description: '', icon: 'Code2' });
    });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Manage Skills</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </button>
      </div>

      {showAddForm && (
        <div className={cn('p-4 rounded-xl mb-6', theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50')}>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Skill Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className={cn('px-4 py-2 rounded-lg', theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-white')}
            />
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value as Skill['category'] })}
              className={cn('px-4 py-2 rounded-lg', theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-white')}
            >
              {skillCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
            <select
              value={formData.level}
              onChange={(e) => setFormData({ ...formData, level: e.target.value as Skill['level'] })}
              className={cn('px-4 py-2 rounded-lg', theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-white')}
            >
              {skillLevels.map(level => <option key={level} value={level}>{level}</option>)}
            </select>
            <input
              type="text"
              placeholder="Icon name (e.g., Code2)"
              value={formData.icon}
              onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
              className={cn('px-4 py-2 rounded-lg', theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-white')}
            />
          </div>
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={cn('w-full px-4 py-2 rounded-lg mb-4', theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-white')}
            rows={2}
          />
          <div className="flex gap-2">
            <button onClick={handleAdd} className="px-4 py-2 rounded-lg bg-green-500 text-white text-sm">
              <Check className="w-4 h-4 inline mr-1" /> Save
            </button>
            <button onClick={() => setShowAddForm(false)} className="px-4 py-2 rounded-lg bg-gray-500 text-white text-sm">
              <X className="w-4 h-4 inline mr-1" /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {skills.map((skill: Skill) => (
          <div key={skill.id} className={cn('p-4 rounded-xl', theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50')}>
            <div className="flex items-center justify-between mb-2">
              <h3 className="font-semibold">{skill.name}</h3>
              <button
                onClick={() => onRequirePassword(() => deleteSkill(skill.id))}
                className="p-1 text-red-500 hover:bg-red-500/10 rounded"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
            <p className={cn('text-sm mb-1', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>{skill.category}</p>
            <span className="text-xs px-2 py-1 bg-indigo-500/20 text-indigo-400 rounded">{skill.level}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// Certifications Manager Component
function CertificationsManager({ theme, certifications, addCertification, deleteCertification, showAddForm, setShowAddForm, onRequirePassword }: any) {
  const [formData, setFormData] = useState<Partial<Certification>>({
    title: '', organization: '', issueDate: '', description: '', imageUrl: ''
  });

  const handleAdd = () => {
    const newCert: Certification = {
      id: Date.now().toString(),
      title: formData.title || '',
      organization: formData.organization || '',
      issueDate: formData.issueDate || '',
      description: formData.description || '',
      imageUrl: formData.imageUrl || 'https://images.unsplash.com/photo-1496200186974-4293800e2c20?w=400&h=300&fit=crop',
    };
    addCertification(newCert);
    setShowAddForm(false);
    setFormData({ title: '', organization: '', issueDate: '', description: '', imageUrl: '' });
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-semibold">Manage Certifications</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center px-4 py-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white text-sm font-medium"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Certification
        </button>
      </div>

      {showAddForm && (
        <div className={cn('p-4 rounded-xl mb-6', theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50')}>
          <div className="grid sm:grid-cols-2 gap-4 mb-4">
            <input
              type="text"
              placeholder="Certification Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              className={cn('px-4 py-2 rounded-lg', theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-white')}
            />
            <input
              type="text"
              placeholder="Issuing Organization"
              value={formData.organization}
              onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
              className={cn('px-4 py-2 rounded-lg', theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-white')}
            />
            <input
              type="month"
              value={formData.issueDate}
              onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
              className={cn('px-4 py-2 rounded-lg', theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-white')}
            />
          </div>
          <div className="mb-4">
            <ImageUpload
              currentImage={formData.imageUrl}
              onImageUpload={(url) => setFormData({ ...formData, imageUrl: url })}
              label="Certificate Image"
              shape="square"
            />
          </div>
          <textarea
            placeholder="Description"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={cn('w-full px-4 py-2 rounded-lg mb-4', theme === 'dark' ? 'bg-gray-600 text-white' : 'bg-white')}
            rows={2}
          />
          <div className="flex gap-2">
            <button onClick={handleAdd} className="px-4 py-2 rounded-lg bg-green-500 text-white text-sm">
              <Check className="w-4 h-4 inline mr-1" /> Save
            </button>
            <button onClick={() => setShowAddForm(false)} className="px-4 py-2 rounded-lg bg-gray-500 text-white text-sm">
              <X className="w-4 h-4 inline mr-1" /> Cancel
            </button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        {certifications.map((cert: Certification) => (
          <div key={cert.id} className={cn('flex items-center p-4 rounded-xl', theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50')}>
            <img src={cert.imageUrl} alt={cert.title} className="w-16 h-16 rounded-lg object-cover mr-4" />
            <div className="flex-1">
              <h3 className="font-semibold">{cert.title}</h3>
              <p className={cn('text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>{cert.organization}</p>
            </div>
            <button onClick={() => deleteCertification(cert.id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg">
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// Requests Manager Component
function RequestsManager({ theme, requests, updateStatus, onRequirePassword }: any) {
  const statusColors = {
    pending: 'bg-amber-500/20 text-amber-500',
    reviewed: 'bg-blue-500/20 text-blue-500',
    accepted: 'bg-green-500/20 text-green-500',
    declined: 'bg-red-500/20 text-red-500',
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Collaboration Requests</h2>
      {requests.length === 0 ? (
        <p className={cn('text-center py-8', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
          No collaboration requests yet
        </p>
      ) : (
        <div className="space-y-4">
          {requests.map((request: any) => (
            <div key={request.id} className={cn('p-4 rounded-xl', theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50')}>
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold">{request.name}</h3>
                  <p className={cn('text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>{request.email}</p>
                </div>
                <span className={cn('px-2 py-1 text-xs rounded-full font-medium', statusColors[request.status as keyof typeof statusColors])}>
                  {request.status}
                </span>
              </div>
              <div className="grid sm:grid-cols-2 gap-2 mb-3 text-sm">
                <p><strong>Project:</strong> {request.projectType}</p>
                <p><strong>Budget:</strong> {request.budgetRange}</p>
              </div>
              <p className={cn('text-sm mb-4', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>{request.message}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => updateStatus(request.id, 'accepted')}
                  className="px-3 py-1 text-xs bg-green-500 text-white rounded-lg"
                >
                  Accept
                </button>
                <button
                  onClick={() => updateStatus(request.id, 'reviewed')}
                  className="px-3 py-1 text-xs bg-blue-500 text-white rounded-lg"
                >
                  Mark Reviewed
                </button>
                <button
                  onClick={() => updateStatus(request.id, 'declined')}
                  className="px-3 py-1 text-xs bg-red-500 text-white rounded-lg"
                >
                  Decline
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Profile Manager Component
function ProfileManager({ theme, profile, updateProfile, onRequirePassword }: any) {
  const [formData, setFormData] = useState(profile);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    updateProfile(formData);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>
      
      {/* Profile Photo Upload */}
      <div className="flex justify-center mb-6">
        <ImageUpload
          currentImage={formData.photoUrl}
          onImageUpload={(url) => setFormData({ ...formData, photoUrl: url })}
          label="Profile Photo"
          shape="circle"
        />
      </div>

      <div className="grid sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className={cn('block text-sm font-medium mb-1', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>Name</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className={cn('w-full px-4 py-2 rounded-lg', theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100')}
          />
        </div>
        <div>
          <label className={cn('block text-sm font-medium mb-1', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>Title</label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={cn('w-full px-4 py-2 rounded-lg', theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100')}
          />
        </div>
        <div>
          <label className={cn('block text-sm font-medium mb-1', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>Email</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className={cn('w-full px-4 py-2 rounded-lg', theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100')}
          />
        </div>
      </div>
      <div className="mb-4">
        <label className={cn('block text-sm font-medium mb-1', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>Short Bio</label>
        <textarea
          value={formData.bio}
          onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          className={cn('w-full px-4 py-2 rounded-lg', theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100')}
          rows={2}
        />
      </div>
      <div className="mb-4">
        <label className={cn('block text-sm font-medium mb-1', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>Detailed Bio</label>
        <textarea
          value={formData.detailedBio}
          onChange={(e) => setFormData({ ...formData, detailedBio: e.target.value })}
          className={cn('w-full px-4 py-2 rounded-lg', theme === 'dark' ? 'bg-gray-700 text-white' : 'bg-gray-100')}
          rows={5}
        />
      </div>
      <button
        onClick={handleSave}
        className={cn(
          'flex items-center px-6 py-3 rounded-xl font-medium text-white transition-all',
          saved ? 'bg-green-500' : 'bg-gradient-to-r from-indigo-500 to-purple-600'
        )}
      >
        {saved ? <><Check className="w-5 h-5 mr-2" /> Saved!</> : 'Save Changes'}
      </button>
    </div>
  );
}

// Data Manager Component - Export/Import
function DataManager({ theme, onRequirePassword }: { theme: string; onRequirePassword: (action: () => void) => void }) {
  const store = useStore();
  const [importStatus, setImportStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [importMessage, setImportMessage] = useState('');
  const [showJsonPreview, setShowJsonPreview] = useState(false);
  const [jsonData, setJsonData] = useState('');

  const getExportData = () => {
    return {
      profile: store.profile,
      skills: store.skills,
      certifications: store.certifications,
      portfolios: store.portfolios,
      collaborationRequests: store.collaborationRequests,
      isSetupComplete: store.isSetupComplete,
      adminPassword: store.adminPassword,
      exportedAt: new Date().toISOString(),
    };
  };

  const handleExport = () => {
    try {
      const data = getExportData();
      const jsonString = JSON.stringify(data, null, 2);
      
      // Use file-saver library for reliable download
      const blob = new Blob([jsonString], { type: 'application/json;charset=utf-8' });
      saveAs(blob, `portfolio-backup-${new Date().toISOString().split('T')[0]}.json`);

      setImportStatus('success');
      setImportMessage('✅ File downloaded! Check your Downloads folder.');
      setTimeout(() => setImportStatus('idle'), 5000);
    } catch (error) {
      console.error('Export error:', error);
      setImportStatus('error');
      setImportMessage('Error exporting. Try "Show JSON" button instead.');
    }
  };

  const handleShowJson = () => {
    const data = getExportData();
    setJsonData(JSON.stringify(data, null, 2));
    setShowJsonPreview(true);
  };

  const handleCopyToClipboard = async () => {
    try {
      const data = getExportData();
      const jsonString = JSON.stringify(data, null, 2);
      await navigator.clipboard.writeText(jsonString);
      setImportStatus('success');
      setImportMessage('✅ Copied to clipboard! Paste it in a text file and save as .json');
      setTimeout(() => setImportStatus('idle'), 5000);
    } catch {
      setImportStatus('error');
      setImportMessage('Could not copy. Use "Show JSON" button instead.');
    }
  };

  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string);
        
        // Validate required fields
        if (!data.profile || !data.skills || !data.portfolios) {
          throw new Error('Invalid data format');
        }

        // Import data
        if (data.profile) store.updateProfile(data.profile);
        if (data.skills) {
          // Clear existing and add new
          store.skills.forEach(s => store.deleteSkill(s.id));
          data.skills.forEach((s: any) => store.addSkill(s));
        }
        if (data.certifications) {
          store.certifications.forEach(c => store.deleteCertification(c.id));
          data.certifications.forEach((c: any) => store.addCertification(c));
        }
        if (data.portfolios) {
          store.portfolios.forEach(p => store.deletePortfolio(p.id));
          data.portfolios.forEach((p: any) => store.addPortfolio(p));
        }

        setImportStatus('success');
        setImportMessage('Data imported successfully! Page will refresh...');
        setTimeout(() => window.location.reload(), 2000);
      } catch {
        setImportStatus('error');
        setImportMessage('Error importing data. Please check the file format.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">Export & Import Data</h2>
      
      <div className="grid md:grid-cols-2 gap-6">
        {/* Export Section */}
        <div className={cn('p-6 rounded-xl', theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50')}>
          <div className="flex items-center mb-4">
            <Download className="w-8 h-8 text-green-500 mr-3" />
            <div>
              <h3 className="font-semibold text-lg">Export Data</h3>
              <p className={cn('text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                Download all your portfolio data as JSON
              </p>
            </div>
          </div>
          <p className={cn('text-sm mb-4', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
            Export includes:
          </p>
          <ul className={cn('text-sm mb-6 space-y-1', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
            <li>✓ Profile information</li>
            <li>✓ All skills ({store.skills.length} items)</li>
            <li>✓ All certifications ({store.certifications.length} items)</li>
            <li>✓ All portfolio projects ({store.portfolios.length} items)</li>
          </ul>
          
          {/* Multiple Export Options */}
          <div className="space-y-3">
            <button
              onClick={handleExport}
              className="w-full flex items-center justify-center px-4 py-3 rounded-xl bg-green-500 hover:bg-green-600 text-white font-medium transition-colors"
            >
              <Download className="w-5 h-5 mr-2" />
              Download JSON File
            </button>
            
            <button
              onClick={handleCopyToClipboard}
              className="w-full flex items-center justify-center px-4 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors"
            >
              <Copy className="w-5 h-5 mr-2" />
              Copy to Clipboard
            </button>
            
            <button
              onClick={handleShowJson}
              className="w-full flex items-center justify-center px-4 py-3 rounded-xl bg-purple-500 hover:bg-purple-600 text-white font-medium transition-colors"
            >
              <Eye className="w-5 h-5 mr-2" />
              Show JSON (Manual Copy)
            </button>
          </div>
          
          {importStatus !== 'idle' && (
            <p className={cn('mt-4 text-sm text-center font-medium', importStatus === 'success' ? 'text-green-500' : 'text-red-500')}>
              {importMessage}
            </p>
          )}
        </div>

        {/* Import Section */}
        <div className={cn('p-6 rounded-xl', theme === 'dark' ? 'bg-gray-700' : 'bg-gray-50')}>
          <div className="flex items-center mb-4">
            <Upload className="w-8 h-8 text-blue-500 mr-3" />
            <div>
              <h3 className="font-semibold text-lg">Import Data</h3>
              <p className={cn('text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                Restore data from exported JSON file
              </p>
            </div>
          </div>
          <p className={cn('text-sm mb-4', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
            ⚠️ Warning: This will replace all existing data!
          </p>
          <label className="block">
            <input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="hidden"
            />
            <span className="w-full flex items-center justify-center px-4 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium transition-colors cursor-pointer">
              <Upload className="w-5 h-5 mr-2" />
              Choose JSON File
            </span>
          </label>
          {importStatus !== 'idle' && (
            <p className={cn('mt-4 text-sm', importStatus === 'success' ? 'text-green-500' : 'text-red-500')}>
              {importMessage}
            </p>
          )}
        </div>
      </div>

      {/* Instructions */}
      <div className={cn('mt-8 p-6 rounded-xl', theme === 'dark' ? 'bg-gray-700/50' : 'bg-blue-50')}>
        <h3 className="font-semibold mb-3">📋 Deployment Instructions</h3>
        <div className={cn('text-sm space-y-3', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
          <p><strong>Step 1:</strong> Fill in all your details using Setup Wizard or Admin Dashboard</p>
          <p><strong>Step 2:</strong> Click "Download JSON File" to export your data</p>
          <p><strong>Step 3:</strong> Save this JSON file safely</p>
          <p><strong>Step 4:</strong> When deploying, you can import this data on the new server</p>
          <p className={cn('p-3 rounded-lg', theme === 'dark' ? 'bg-gray-800' : 'bg-white')}>
            💡 <strong>Tip:</strong> For permanent deployment, consider using Firebase database. 
            This way data persists for all visitors automatically!
          </p>
        </div>
      </div>

      {/* JSON Preview Modal */}
      {showJsonPreview && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className={cn('w-full max-w-4xl max-h-[80vh] rounded-2xl overflow-hidden', theme === 'dark' ? 'bg-gray-800' : 'bg-white')}>
            <div className={cn('flex items-center justify-between p-4 border-b', theme === 'dark' ? 'border-gray-700' : 'border-gray-200')}>
              <h3 className="font-semibold text-lg">📄 Your Portfolio Data (JSON)</h3>
              <button 
                onClick={() => setShowJsonPreview(false)}
                className="p-2 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <div className="p-4">
              <p className={cn('text-sm mb-3', theme === 'dark' ? 'text-gray-400' : 'text-gray-600')}>
                👇 Neeche saara data hai. Select All (Ctrl+A) karke Copy (Ctrl+C) karo, phir Notepad mein paste karke <strong>.json</strong> file save karo.
              </p>
              <textarea
                readOnly
                value={jsonData}
                className={cn(
                  'w-full h-64 p-4 rounded-lg font-mono text-xs',
                  theme === 'dark' ? 'bg-gray-900 text-green-400' : 'bg-gray-100 text-gray-800'
                )}
                onClick={(e) => (e.target as HTMLTextAreaElement).select()}
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={async () => {
                    await navigator.clipboard.writeText(jsonData);
                    setImportMessage('✅ Copied!');
                    setTimeout(() => setImportMessage(''), 2000);
                  }}
                  className="flex-1 flex items-center justify-center px-4 py-3 rounded-xl bg-blue-500 hover:bg-blue-600 text-white font-medium"
                >
                  <Copy className="w-5 h-5 mr-2" />
                  Copy All
                </button>
                <button
                  onClick={() => setShowJsonPreview(false)}
                  className="flex-1 px-4 py-3 rounded-xl bg-gray-500 hover:bg-gray-600 text-white font-medium"
                >
                  Close
                </button>
              </div>
              {importMessage && (
                <p className="mt-3 text-center text-green-500 font-medium">{importMessage}</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Email Settings Manager Component
function EmailSettingsManager({ theme, emailConfig, updateEmailConfig, onRequirePassword }: any) {
  const [serviceId, setServiceId] = useState(emailConfig?.serviceId || '');
  const [templateId, setTemplateId] = useState(emailConfig?.templateId || '');
  const [publicKey, setPublicKey] = useState(emailConfig?.publicKey || '');
  const [saved, setSaved] = useState(false);
  const [testStatus, setTestStatus] = useState<'idle' | 'testing' | 'success' | 'error'>('idle');
  const [testError, setTestError] = useState('');
  const [showTemplate, setShowTemplate] = useState(false);

  const isConfigured = serviceId && templateId && publicKey;

  const handleSave = () => {
    updateEmailConfig({
      serviceId,
      templateId,
      publicKey,
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  const handleTest = async () => {
    if (!isConfigured) return;
    
    setTestStatus('testing');
    setTestError('');
    try {
      const emailjs = await import('@emailjs/browser');
      
      // Initialize first
      emailjs.init(publicKey);
      
      const result = await emailjs.send(
        serviceId,
        templateId,
        {
          from_name: 'Test User',
          from_email: 'test@portfolio.com',
          reply_to: 'test@portfolio.com',
          project_type: 'Web Application',
          budget_range: '$1,000 - $5,000',
          message: '🎉 This is a TEST email from your portfolio website! If you received this, EmailJS is working correctly.',
          to_name: 'Admin',
          user_name: 'Test User',
          user_email: 'test@portfolio.com',
          subject: 'Test Email - Portfolio Website',
        },
        publicKey
      );
      
      console.log('✅ Test email result:', result);
      
      if (result.status === 200) {
        setTestStatus('success');
      } else {
        setTestStatus('error');
        setTestError(`Unexpected status: ${result.status}`);
      }
      setTimeout(() => setTestStatus('idle'), 8000);
    } catch (error: any) {
      console.error('❌ Email test failed:', error);
      setTestStatus('error');
      setTestError(error?.text || error?.message || 'Check Service ID, Template ID aur Public Key');
      setTimeout(() => setTestStatus('idle'), 10000);
    }
  };

  const templateContent = `Subject: New Collaboration Request from {{from_name}}

Hello {{to_name}},

You have a new collaboration request!

👤 Name: {{from_name}}
📧 Email: {{from_email}}
💼 Project Type: {{project_type}}
💰 Budget: {{budget_range}}

📝 Message:
{{message}}

---
Sent from your Portfolio Website`;

  return (
    <div>
      <h2 className="text-xl font-semibold mb-6">📧 Email Notification Settings</h2>
      
      {/* Status Banner */}
      <div className={cn(
        'p-4 rounded-xl mb-6 flex items-center',
        isConfigured
          ? 'bg-green-500/20 border border-green-500/50'
          : 'bg-amber-500/20 border border-amber-500/50'
      )}>
        {isConfigured ? (
          <>
            <Check className="w-6 h-6 text-green-500 mr-3" />
            <div>
              <p className="font-medium text-green-500">Email Configured ✓</p>
              <p className={cn('text-sm', theme === 'dark' ? 'text-green-400' : 'text-green-600')}>
                Jab koi collaboration form submit karega toh aapko email aayegi
              </p>
            </div>
          </>
        ) : (
          <>
            <MessageSquare className="w-6 h-6 text-amber-500 mr-3" />
            <div>
              <p className="font-medium text-amber-500">Email Not Configured</p>
              <p className={cn('text-sm', theme === 'dark' ? 'text-amber-400' : 'text-amber-600')}>
                EmailJS setup karo taaki collaboration requests ki notification mile
              </p>
            </div>
          </>
        )}
      </div>

      {/* Setup Instructions */}
      <div className={cn('p-4 rounded-xl mb-6', theme === 'dark' ? 'bg-blue-500/20' : 'bg-blue-50')}>
        <h3 className="font-semibold mb-3 text-blue-500">🔧 EmailJS Setup (FREE - 3 Steps)</h3>
        <ol className={cn('text-sm space-y-2 list-decimal list-inside', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
          <li>
            <a href="https://www.emailjs.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-500 underline font-medium">
              emailjs.com
            </a>
            {' '}pe jao aur FREE account banao (Sign Up with Google easy hai)
          </li>
          <li>
            <strong>Email Service</strong> add karo:
            <ul className="ml-6 mt-1 space-y-1 list-disc">
              <li>Dashboard pe "Add New Service" click karo</li>
              <li>Gmail select karo (sabse easy)</li>
              <li>Connect with Gmail button pe click karo</li>
              <li>"Create Service" click karo</li>
              <li><strong>Service ID</strong> copy karo (neeche paste karo)</li>
            </ul>
          </li>
          <li>
            <strong>Email Template</strong> banao:
            <ul className="ml-6 mt-1 space-y-1 list-disc">
              <li>"Email Templates" section mein jao</li>
              <li>"Create New Template" click karo</li>
              <li>Template mein yeh variables use karo: {`{{from_name}}, {{from_email}}, {{project_type}}, {{budget_range}}, {{message}}`}</li>
              <li>"Save" karo</li>
              <li><strong>Template ID</strong> copy karo</li>
            </ul>
          </li>
          <li>
            <strong>Public Key</strong> le lo:
            <ul className="ml-6 mt-1 space-y-1 list-disc">
              <li>"Account" &gt; "General" section mein jao</li>
              <li><strong>Public Key</strong> copy karo</li>
            </ul>
          </li>
        </ol>
      </div>

      {/* Form */}
      <div className="space-y-4">
        <div>
          <label className={cn('block text-sm font-medium mb-2', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
            Service ID
          </label>
          <input
            type="text"
            value={serviceId}
            onChange={(e) => setServiceId(e.target.value)}
            placeholder="e.g., service_abc123xyz"
            className={cn(
              'w-full px-4 py-3 rounded-xl border-2 transition-all',
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-indigo-500'
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-500'
            )}
          />
        </div>

        <div>
          <label className={cn('block text-sm font-medium mb-2', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
            Template ID
          </label>
          <input
            type="text"
            value={templateId}
            onChange={(e) => setTemplateId(e.target.value)}
            placeholder="e.g., template_xyz789abc"
            className={cn(
              'w-full px-4 py-3 rounded-xl border-2 transition-all',
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-indigo-500'
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-500'
            )}
          />
        </div>

        <div>
          <label className={cn('block text-sm font-medium mb-2', theme === 'dark' ? 'text-gray-300' : 'text-gray-700')}>
            Public Key
          </label>
          <input
            type="text"
            value={publicKey}
            onChange={(e) => setPublicKey(e.target.value)}
            placeholder="e.g., user_ABCDefgh123456"
            className={cn(
              'w-full px-4 py-3 rounded-xl border-2 transition-all',
              theme === 'dark'
                ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-500 focus:border-indigo-500'
                : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-500'
            )}
          />
        </div>

        {/* Buttons */}
        <div className="flex gap-4 pt-4">
          <button
            onClick={handleSave}
            className={cn(
              'flex-1 flex items-center justify-center px-6 py-3 rounded-xl font-medium text-white transition-all',
              saved ? 'bg-green-500' : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-lg'
            )}
          >
            {saved ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                Saved!
              </>
            ) : (
              'Save Settings'
            )}
          </button>

          <button
            onClick={handleTest}
            disabled={!isConfigured || testStatus === 'testing'}
            className={cn(
              'flex items-center justify-center px-6 py-3 rounded-xl font-medium transition-all',
              !isConfigured || testStatus === 'testing'
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : testStatus === 'success'
                  ? 'bg-green-500 text-white'
                  : testStatus === 'error'
                    ? 'bg-red-500 text-white'
                    : theme === 'dark'
                      ? 'bg-gray-700 text-white hover:bg-gray-600'
                      : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
            )}
          >
            {testStatus === 'testing' ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Testing...
              </>
            ) : testStatus === 'success' ? (
              <>
                <Check className="w-5 h-5 mr-2" />
                Email Sent!
              </>
            ) : testStatus === 'error' ? (
              <>
                <X className="w-5 h-5 mr-2" />
                Failed - Check Console
              </>
            ) : (
              'Test Email'
            )}
          </button>
        </div>

        {testStatus === 'success' && (
          <div className="mt-4 p-4 rounded-xl bg-green-500/20 border border-green-500/50">
            <p className="text-green-500 text-sm font-medium">
              ✅ Test email SUCCESSFULLY bheji gayi!
            </p>
            <p className={cn('text-xs mt-1', theme === 'dark' ? 'text-green-400' : 'text-green-600')}>
              Apna Gmail inbox check karo (spam folder bhi dekho). Agar email aayi toh sab kuch kaam kar raha hai! 🎉
            </p>
          </div>
        )}

        {testStatus === 'error' && (
          <div className="mt-4 p-4 rounded-xl bg-red-500/20 border border-red-500/50">
            <p className="text-red-500 text-sm font-medium">
              ❌ Email bhejne mein error aayi!
            </p>
            {testError && (
              <p className="text-red-400 text-xs mt-1 bg-red-500/10 p-2 rounded font-mono">
                Error: {testError}
              </p>
            )}
            <ul className={cn('text-xs mt-2 space-y-1', theme === 'dark' ? 'text-red-300' : 'text-red-600')}>
              <li>• Service ID sahi hai? EmailJS Dashboard se check karo</li>
              <li>• Template ID sahi hai? Email Templates section se check karo</li>
              <li>• Public Key sahi hai? Account &gt; General se check karo</li>
              <li>• Gmail service connected hai? Services section se check karo</li>
            </ul>
          </div>
        )}
      </div>

      {/* Email Template Preview */}
      <div className={cn('mt-6 p-4 rounded-xl', theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-50')}>
        <button 
          onClick={() => setShowTemplate(!showTemplate)}
          className="w-full flex items-center justify-between text-left"
        >
          <h3 className="font-semibold">📋 EmailJS Template - Copy Paste Karo</h3>
          <span className={cn('text-sm', theme === 'dark' ? 'text-gray-400' : 'text-gray-500')}>
            {showTemplate ? '▲ Hide' : '▼ Show'}
          </span>
        </button>
        
        {showTemplate && (
          <div className="mt-4 space-y-4">
            <p className={cn('text-sm', theme === 'dark' ? 'text-gray-300' : 'text-gray-600')}>
              EmailJS mein jab template banao, toh yeh content paste karo:
            </p>
            
            <div className={cn('p-4 rounded-lg font-mono text-xs whitespace-pre-wrap', theme === 'dark' ? 'bg-gray-900 text-green-400' : 'bg-gray-200 text-gray-800')}>
              {templateContent}
            </div>
            
            <button
              onClick={async () => {
                await navigator.clipboard.writeText(templateContent);
                setSaved(true);
                setTimeout(() => setSaved(false), 2000);
              }}
              className="px-4 py-2 rounded-lg bg-blue-500 hover:bg-blue-600 text-white text-sm font-medium transition-colors"
            >
              📋 Copy Template
            </button>

            <div className={cn('p-3 rounded-lg text-sm', theme === 'dark' ? 'bg-amber-500/20 text-amber-300' : 'bg-amber-50 text-amber-700')}>
              <strong>⚠️ Important:</strong> EmailJS template mein {`"To Email"`} field mein apni email dalo jahan notifications receive karna hai.
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
