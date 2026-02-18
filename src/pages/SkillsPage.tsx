import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Code2, Monitor, Shield, Cloud, Wrench, Terminal, 
  Server, Database, Lock, Users, FileCode, Container 
} from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/utils/cn';
import type { Skill } from '@/types';

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  Code2, Monitor, Shield, Cloud, Wrench, Terminal,
  Server, Database, Lock, Users, FileCode, Container,
};

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  Development: { bg: 'from-blue-500 to-cyan-500', text: 'text-blue-500', border: 'border-blue-500' },
  Windows: { bg: 'from-indigo-500 to-purple-500', text: 'text-indigo-500', border: 'border-indigo-500' },
  Security: { bg: 'from-red-500 to-orange-500', text: 'text-red-500', border: 'border-red-500' },
  Deployment: { bg: 'from-green-500 to-emerald-500', text: 'text-green-500', border: 'border-green-500' },
  Troubleshooting: { bg: 'from-amber-500 to-yellow-500', text: 'text-amber-500', border: 'border-amber-500' },
};

const levelProgress: Record<string, number> = {
  Beginner: 25,
  Intermediate: 50,
  Advanced: 75,
  Expert: 100,
};

export function SkillsPage() {
  const { theme, skills } = useStore();
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'name' | 'level'>('level');

  const categories = useMemo(() => {
    return ['all', ...new Set(skills.map((s) => s.category))];
  }, [skills]);

  const filteredSkills = useMemo(() => {
    let filtered = [...skills];

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((s) => s.category === selectedCategory);
    }

    filtered.sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return levelProgress[b.level] - levelProgress[a.level];
    });

    return filtered;
  }, [skills, selectedCategory, sortBy]);

  const groupedSkills = useMemo(() => {
    if (selectedCategory !== 'all') return { [selectedCategory]: filteredSkills };
    
    return filteredSkills.reduce((acc, skill) => {
      if (!acc[skill.category]) acc[skill.category] = [];
      acc[skill.category].push(skill);
      return acc;
    }, {} as Record<string, Skill[]>);
  }, [filteredSkills, selectedCategory]);

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Skills & Expertise</h1>
          <p className={cn(
            'text-lg max-w-2xl mx-auto',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            A comprehensive overview of my technical skills and areas of expertise
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="flex flex-wrap justify-center gap-2 mb-8"
        >
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={cn(
                'px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200',
                selectedCategory === cat
                  ? 'bg-gradient-to-r from-indigo-500 to-purple-600 text-white'
                  : theme === 'dark'
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-700'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              )}
            >
              {cat === 'all' ? 'All Skills' : cat}
            </button>
          ))}
        </motion.div>

        {/* Sort */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
          className="flex justify-end mb-8"
        >
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as 'name' | 'level')}
            className={cn(
              'px-4 py-2 rounded-xl text-sm focus:ring-2 focus:ring-indigo-500 border-0',
              theme === 'dark' 
                ? 'bg-gray-800 text-white' 
                : 'bg-gray-100 text-gray-900'
            )}
          >
            <option value="level">Sort by Level</option>
            <option value="name">Sort by Name</option>
          </select>
        </motion.div>

        {/* Skills Grid */}
        <div className="space-y-12">
          {Object.entries(groupedSkills).map(([category, categorySkills], catIndex) => (
            <motion.div
              key={category}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: catIndex * 0.1 }}
            >
              <h2 className={cn(
                'text-2xl font-bold mb-6 flex items-center',
                categoryColors[category]?.text || 'text-indigo-500'
              )}>
                <div className={cn(
                  'w-8 h-8 rounded-lg mr-3 flex items-center justify-center bg-gradient-to-r',
                  categoryColors[category]?.bg || 'from-indigo-500 to-purple-500'
                )}>
                  <Code2 className="w-4 h-4 text-white" />
                </div>
                {category}
              </h2>

              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <AnimatePresence mode="popLayout">
                  {categorySkills.map((skill, index) => {
                    const IconComponent = iconMap[skill.icon] || Code2;
                    return (
                      <motion.div
                        key={skill.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.05 }}
                        className={cn(
                          'p-6 rounded-2xl transition-all duration-300 hover:shadow-lg group',
                          theme === 'dark' 
                            ? 'bg-gray-800 hover:shadow-indigo-500/10' 
                            : 'bg-white shadow-lg hover:shadow-gray-300'
                        )}
                      >
                        <div className="flex items-start justify-between mb-4">
                          <div className={cn(
                            'w-12 h-12 rounded-xl flex items-center justify-center bg-gradient-to-r',
                            categoryColors[skill.category]?.bg || 'from-indigo-500 to-purple-500'
                          )}>
                            <IconComponent className="w-6 h-6 text-white" />
                          </div>
                          <span className={cn(
                            'px-3 py-1 rounded-full text-xs font-medium',
                            skill.level === 'Expert'
                              ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                              : skill.level === 'Advanced'
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                                : skill.level === 'Intermediate'
                                  ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                  : 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300'
                          )}>
                            {skill.level}
                          </span>
                        </div>

                        <h3 className="text-lg font-semibold mb-2">{skill.name}</h3>
                        <p className={cn(
                          'text-sm mb-4',
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        )}>
                          {skill.description}
                        </p>

                        {/* Progress bar */}
                        <div className={cn(
                          'h-2 rounded-full overflow-hidden',
                          theme === 'dark' ? 'bg-gray-700' : 'bg-gray-200'
                        )}>
                          <motion.div
                            initial={{ width: 0 }}
                            whileInView={{ width: `${levelProgress[skill.level]}%` }}
                            viewport={{ once: true }}
                            transition={{ duration: 1, delay: 0.2 }}
                            className={cn(
                              'h-full rounded-full bg-gradient-to-r',
                              categoryColors[skill.category]?.bg || 'from-indigo-500 to-purple-500'
                            )}
                          />
                        </div>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
