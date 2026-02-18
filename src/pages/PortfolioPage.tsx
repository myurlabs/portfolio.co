import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, Calendar, Tag } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/utils/cn';

export function PortfolioPage() {
  const { theme, portfolios } = useStore();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'newest' | 'oldest'>('newest');

  const categories = useMemo(() => {
    const cats = ['all', ...new Set(portfolios.map((p) => p.category))];
    return cats;
  }, [portfolios]);

  const filteredPortfolios = useMemo(() => {
    let filtered = [...portfolios];

    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (p) =>
          p.title.toLowerCase().includes(query) ||
          p.description.toLowerCase().includes(query) ||
          p.tags.some((t) => t.toLowerCase().includes(query))
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    filtered.sort((a, b) => {
      const dateA = new Date(a.createdAt).getTime();
      const dateB = new Date(b.createdAt).getTime();
      return sortBy === 'newest' ? dateB - dateA : dateA - dateB;
    });

    return filtered;
  }, [portfolios, searchQuery, selectedCategory, sortBy]);

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Portfolio</h1>
          <p className={cn(
            'text-lg max-w-2xl mx-auto',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            A collection of projects showcasing my expertise in software development, 
            Windows administration, and cloud solutions
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className={cn(
            'p-4 rounded-2xl mb-8',
            theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
          )}
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="relative flex-1">
              <Search className={cn(
                'absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5',
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              )} />
              <input
                type="text"
                placeholder="Search projects..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className={cn(
                  'w-full pl-10 pr-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-indigo-500',
                  theme === 'dark' 
                    ? 'bg-gray-700 text-white placeholder-gray-400' 
                    : 'bg-white text-gray-900 placeholder-gray-500'
                )}
              />
            </div>

            {/* Category filter */}
            <div className="flex items-center space-x-2">
              <Filter className={cn(
                'w-5 h-5',
                theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
              )} />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className={cn(
                  'px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-indigo-500',
                  theme === 'dark' 
                    ? 'bg-gray-700 text-white' 
                    : 'bg-white text-gray-900'
                )}
              >
                {categories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat === 'all' ? 'All Categories' : cat}
                  </option>
                ))}
              </select>
            </div>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'newest' | 'oldest')}
              className={cn(
                'px-4 py-3 rounded-xl border-0 focus:ring-2 focus:ring-indigo-500',
                theme === 'dark' 
                  ? 'bg-gray-700 text-white' 
                  : 'bg-white text-gray-900'
              )}
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
            </select>
          </div>
        </motion.div>

        {/* Results count */}
        <p className={cn(
          'mb-6',
          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
        )}>
          Showing {filteredPortfolios.length} of {portfolios.length} projects
        </p>

        {/* Portfolio Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredPortfolios.map((project, index) => (
              <motion.div
                key={project.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ delay: index * 0.05 }}
              >
                <Link
                  to={`/portfolio/${project.id}`}
                  className={cn(
                    'block rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl group h-full',
                    theme === 'dark' 
                      ? 'bg-gray-800 hover:shadow-indigo-500/10' 
                      : 'bg-white shadow-lg hover:shadow-gray-300'
                  )}
                >
                  <div className="relative h-56 overflow-hidden">
                    <img
                      src={project.images[0]}
                      alt={project.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <span className="text-white text-sm font-medium px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm">
                        {project.category}
                      </span>
                    </div>
                    {project.featured && (
                      <div className="absolute top-4 right-4">
                        <span className="text-white text-xs font-medium px-3 py-1 rounded-full bg-gradient-to-r from-amber-400 to-orange-500">
                          Featured
                        </span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex items-center text-sm mb-3">
                      <Calendar className={cn(
                        'w-4 h-4 mr-2',
                        theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                      )} />
                      <span className={cn(
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                      )}>
                        {new Date(project.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                        })}
                      </span>
                    </div>

                    <h3 className="text-xl font-semibold mb-3 group-hover:text-indigo-500 transition-colors">
                      {project.title}
                    </h3>

                    <p className={cn(
                      'text-sm mb-4 line-clamp-3',
                      theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                    )}>
                      {project.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {project.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className={cn(
                            'flex items-center text-xs px-2 py-1 rounded-md',
                            theme === 'dark' 
                              ? 'bg-gray-700 text-gray-300' 
                              : 'bg-gray-100 text-gray-600'
                          )}
                        >
                          <Tag className="w-3 h-3 mr-1" />
                          {tag}
                        </span>
                      ))}
                      {project.tags.length > 4 && (
                        <span className={cn(
                          'text-xs px-2 py-1 rounded-md',
                          theme === 'dark' 
                            ? 'bg-gray-700 text-gray-400' 
                            : 'bg-gray-100 text-gray-500'
                        )}>
                          +{project.tags.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredPortfolios.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              'text-center py-16 rounded-2xl',
              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
            )}
          >
            <p className={cn(
              'text-lg',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              No projects found matching your criteria
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
