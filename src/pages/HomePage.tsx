import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, ChevronRight, Sparkles, Code2, Monitor, Shield } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/utils/cn';

const categoryIcons: Record<string, typeof Code2> = {
  Development: Code2,
  Windows: Monitor,
  Security: Shield,
  Deployment: Code2,
  Troubleshooting: Monitor,
};

export function HomePage() {
  const { theme, profile, skills, portfolios } = useStore();

  const featuredPortfolios = portfolios.filter((p) => p.featured).slice(0, 3);
  const previewSkills = skills.slice(0, 6);

  return (
    <div className="overflow-hidden">

      {/* HERO */}
      <section className={cn(
        'relative min-h-screen flex items-center',
        theme === 'dark' ? 'bg-gray-900' : 'bg-white'
      )}>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="grid lg:grid-cols-2 gap-12 items-center">

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className={cn(
                'inline-flex items-center px-4 py-2 rounded-full text-sm font-medium mb-6',
                theme === 'dark'
                  ? 'bg-indigo-500/20 text-indigo-300'
                  : 'bg-indigo-100 text-indigo-700'
              )}>
                <Sparkles className="w-4 h-4 mr-2" />
                Available for Projects
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold leading-tight mb-6">
                Hi, I'm{' '}
                <span className="bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent">
                  {profile.name || "Developer"}
                </span>
              </h1>

              <p className={cn(
                'text-xl lg:text-2xl font-medium mb-4',
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              )}>
                {profile.title || "Software Engineer"}
              </p>

              <p className={cn(
                'text-lg mb-8 max-w-xl',
                theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
              )}>
                {profile.bio || "Building modern digital experiences."}
              </p>

              <div className="flex flex-wrap gap-4">
                <Link
                  to="/collaborate"
                  className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:shadow-lg transition-all"
                >
                  Collaborate With Me
                  <ArrowRight className="w-5 h-5 ml-2" />
                </Link>

                <Link
                  to="/portfolio"
                  className={cn(
                    'inline-flex items-center px-6 py-3 rounded-xl font-medium border-2 transition-all',
                    theme === 'dark'
                      ? 'border-gray-700 text-gray-300 hover:bg-gray-800'
                      : 'border-gray-300 text-gray-700 hover:bg-gray-100'
                  )}
                >
                  View Portfolio
                </Link>
              </div>
            </motion.div>

            {/* PHOTO SAFE RENDER */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative hidden lg:block"
            >
              <div className={cn(
                'relative rounded-3xl overflow-hidden shadow-2xl',
                theme === 'dark' ? 'shadow-indigo-500/10' : 'shadow-gray-200'
              )}>

                {profile.photoUrl ? (
                  <img
                    src={profile.photoUrl}
                    alt="profile"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-96 bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                    No Photo
                  </div>
                )}

                <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              </div>
            </motion.div>

          </div>
        </div>
      </section>

      {/* FEATURED PORTFOLIO SAFE */}
      <section className={cn(
        'py-20',
        theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'
      )}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

          <h2 className="text-3xl font-bold mb-12 text-center">
            Featured Work
          </h2>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPortfolios.map((project) => (
              <Link
                key={project.id}
                to={`/portfolio/${project.id}`}
                className={cn(
                  'block rounded-2xl overflow-hidden hover:shadow-xl',
                  theme === 'dark' ? 'bg-gray-800' : 'bg-white'
                )}
              >

                {project.images?.[0] ? (
                  <img
                    src={project.images[0]}
                    alt={project.title}
                    className="w-full h-48 object-cover"
                  />
                ) : (
                  <div className="w-full h-48 bg-gray-300 dark:bg-gray-700 flex items-center justify-center">
                    No Image
                  </div>
                )}

                <div className="p-6">
                  <h3 className="font-semibold text-xl mb-2">
                    {project.title}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {project.description}
                  </p>
                </div>

              </Link>
            ))}
          </div>

        </div>
      </section>

    </div>
  );
}
