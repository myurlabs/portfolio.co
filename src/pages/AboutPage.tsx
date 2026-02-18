import { motion } from 'framer-motion';
import { Download, Calendar, Briefcase, GraduationCap, Award } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/utils/cn';

const timelineIcons = {
  education: GraduationCap,
  work: Briefcase,
  achievement: Award,
};

export function AboutPage() {
  const { theme, profile, certifications } = useStore();

  return (
    <div className="py-12">
      {/* Hero */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="grid lg:grid-cols-2 gap-12 items-center"
        >
          <div>
            <h1 className="text-4xl sm:text-5xl font-bold mb-6">About Me</h1>
            <div className={cn(
              'prose prose-lg max-w-none',
              theme === 'dark' ? 'prose-invert' : ''
            )}>
              {profile.detailedBio.split('\n\n').map((paragraph, index) => (
                <p key={index} className={cn(
                  theme === 'dark' ? 'text-gray-300' : 'text-gray-600'
                )}>
                  {paragraph}
                </p>
              ))}
            </div>
            <div className="mt-8">
              <a
                href={profile.resumeUrl}
                download
                className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300"
              >
                <Download className="w-5 h-5 mr-2" />
                Download Resume
              </a>
            </div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="relative"
          >
            <div className="grid grid-cols-2 gap-4">
              {profile.galleryPhotos.slice(0, 4).map((photo, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 * index }}
                  className={cn(
                    'rounded-2xl overflow-hidden shadow-lg',
                    index === 0 ? 'col-span-2' : ''
                  )}
                >
                  <img
                    src={photo}
                    alt={`Gallery photo ${index + 1}`}
                    className={cn(
                      'w-full object-cover',
                      index === 0 ? 'h-64' : 'h-40'
                    )}
                  />
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Career Timeline */}
      <section className={cn(
        'py-20',
        theme === 'dark' ? 'bg-gray-800/50' : 'bg-gray-50'
      )}>
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Career Journey</h2>
            <p className={cn(
              'text-lg',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              The milestones that shaped my professional path
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline line */}
            <div className={cn(
              'absolute left-8 top-0 bottom-0 w-0.5',
              theme === 'dark' ? 'bg-gray-700' : 'bg-gray-300'
            )} />

            <div className="space-y-8">
              {profile.careerTimeline.map((event, index) => {
                const Icon = timelineIcons[event.type];
                return (
                  <motion.div
                    key={event.id}
                    initial={{ opacity: 0, x: -20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="relative pl-20"
                  >
                    {/* Timeline dot */}
                    <div className={cn(
                      'absolute left-4 w-8 h-8 rounded-full flex items-center justify-center',
                      event.type === 'achievement' 
                        ? 'bg-gradient-to-r from-amber-400 to-orange-500' 
                        : event.type === 'education'
                          ? 'bg-gradient-to-r from-blue-400 to-cyan-500'
                          : 'bg-gradient-to-r from-indigo-400 to-purple-500'
                    )}>
                      <Icon className="w-4 h-4 text-white" />
                    </div>

                    <div className={cn(
                      'p-6 rounded-2xl',
                      theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-lg'
                    )}>
                      <div className="flex items-center mb-2">
                        <Calendar className={cn(
                          'w-4 h-4 mr-2',
                          theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                        )} />
                        <span className={cn(
                          'text-sm font-medium',
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                        )}>
                          {event.year}
                        </span>
                      </div>
                      <h3 className="text-xl font-semibold mb-2">{event.title}</h3>
                      <p className={cn(
                        theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                      )}>
                        {event.description}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Stats - Only show if admin has filled the data */}
      {(profile.stats?.yearsExperience > 0 || profile.stats?.projectsCompleted > 0 || profile.stats?.happyClients > 0 || certifications.length > 0) && (
        <section className="py-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { value: profile.stats?.yearsExperience || 0, label: 'Years Experience', show: profile.stats?.yearsExperience > 0 },
                { value: profile.stats?.projectsCompleted || 0, label: 'Projects Completed', show: profile.stats?.projectsCompleted > 0 },
                { value: profile.stats?.happyClients || 0, label: 'Happy Clients', show: profile.stats?.happyClients > 0 },
                { value: certifications.length, label: 'Certifications', show: certifications.length > 0 },
              ].filter(stat => stat.show).map((stat, index) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="text-center"
                >
                  <div className="text-4xl sm:text-5xl font-bold bg-gradient-to-r from-indigo-500 to-purple-600 bg-clip-text text-transparent mb-2">
                    {stat.value}+
                  </div>
                  <p className={cn(
                    'text-sm sm:text-base',
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  )}>
                    {stat.label}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
