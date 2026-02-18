import { useParams, Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Tag, ExternalLink, Play, FileText } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/utils/cn';

export function PortfolioDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { theme, portfolios } = useStore();
  const project = portfolios.find((p) => p.id === id);

  if (!project) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
        <Link to="/portfolio" className="text-indigo-500 hover:underline">
          Return to Portfolio
        </Link>
      </div>
    );
  }

  const relatedProjects = portfolios
    .filter((p) => p.id !== id && p.category === project.category)
    .slice(0, 3);

  return (
    <div className="py-12">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back button */}
        <motion.button
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          onClick={() => navigate(-1)}
          className={cn(
            'flex items-center mb-8 text-sm font-medium transition-colors',
            theme === 'dark' 
              ? 'text-gray-400 hover:text-white' 
              : 'text-gray-600 hover:text-gray-900'
          )}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Back
        </motion.button>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <span className={cn(
              'px-3 py-1 rounded-full text-sm font-medium',
              theme === 'dark' 
                ? 'bg-indigo-500/20 text-indigo-300' 
                : 'bg-indigo-100 text-indigo-700'
            )}>
              {project.category}
            </span>
            {project.featured && (
              <span className="px-3 py-1 rounded-full text-sm font-medium bg-gradient-to-r from-amber-400 to-orange-500 text-white">
                Featured
              </span>
            )}
            <span className={cn(
              'flex items-center text-sm',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
            )}>
              <Calendar className="w-4 h-4 mr-2" />
              {new Date(project.createdAt).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold mb-4">{project.title}</h1>
          
          <p className={cn(
            'text-lg',
            theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
          )}>
            {project.description}
          </p>
        </motion.div>

        {/* Main Image */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-8"
        >
          <div className="rounded-2xl overflow-hidden shadow-2xl">
            <img
              src={project.images[0]}
              alt={project.title}
              className="w-full h-auto"
            />
          </div>
        </motion.div>

        {/* Additional Images */}
        {project.images.length > 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="grid grid-cols-2 gap-4 mb-8"
          >
            {project.images.slice(1).map((image, index) => (
              <div key={index} className="rounded-xl overflow-hidden shadow-lg">
                <img
                  src={image}
                  alt={`${project.title} - ${index + 2}`}
                  className="w-full h-48 object-cover"
                />
              </div>
            ))}
          </motion.div>
        )}

        {/* Video */}
        {project.videoUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="mb-8"
          >
            <h2 className="text-xl font-semibold mb-4 flex items-center">
              <Play className="w-5 h-5 mr-2" />
              Video Demo
            </h2>
            <div className={cn(
              'rounded-2xl overflow-hidden',
              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
            )}>
              <div className="aspect-video">
                <iframe
                  src={project.videoUrl}
                  title="Project Video"
                  className="w-full h-full"
                  allowFullScreen
                />
              </div>
            </div>
          </motion.div>
        )}

        {/* PDF Attachment */}
        {project.pdfUrl && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-8"
          >
            <a
              href={project.pdfUrl}
              target="_blank"
              rel="noopener noreferrer"
              className={cn(
                'flex items-center p-4 rounded-xl transition-colors',
                theme === 'dark' 
                  ? 'bg-gray-800 hover:bg-gray-750' 
                  : 'bg-gray-100 hover:bg-gray-200'
              )}
            >
              <FileText className="w-6 h-6 text-indigo-500 mr-3" />
              <div>
                <p className="font-medium">Project Documentation</p>
                <p className={cn(
                  'text-sm',
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                )}>
                  View PDF attachment
                </p>
              </div>
              <ExternalLink className={cn(
                'w-5 h-5 ml-auto',
                theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
              )} />
            </a>
          </motion.div>
        )}

        {/* Tags */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <h2 className="text-xl font-semibold mb-4">Technologies Used</h2>
          <div className="flex flex-wrap gap-2">
            {project.tags.map((tag) => (
              <span
                key={tag}
                className={cn(
                  'flex items-center px-4 py-2 rounded-xl text-sm font-medium',
                  theme === 'dark' 
                    ? 'bg-gray-800 text-gray-300' 
                    : 'bg-gray-100 text-gray-700'
                )}
              >
                <Tag className="w-4 h-4 mr-2 text-indigo-500" />
                {tag}
              </span>
            ))}
          </div>
        </motion.div>

        {/* Related Projects */}
        {relatedProjects.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h2 className="text-2xl font-semibold mb-6">Related Projects</h2>
            <div className="grid md:grid-cols-3 gap-6">
              {relatedProjects.map((related) => (
                <Link
                  key={related.id}
                  to={`/portfolio/${related.id}`}
                  className={cn(
                    'block rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg group',
                    theme === 'dark' 
                      ? 'bg-gray-800 hover:shadow-indigo-500/10' 
                      : 'bg-white shadow-md hover:shadow-gray-300'
                  )}
                >
                  <div className="relative h-32 overflow-hidden">
                    <img
                      src={related.images[0]}
                      alt={related.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-semibold group-hover:text-indigo-500 transition-colors line-clamp-1">
                      {related.title}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
}
