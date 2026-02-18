import { motion } from 'framer-motion';
import { Calendar, Building2, ExternalLink, FileText, Download } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/utils/cn';

export function CertificationsPage() {
  const { theme, certifications } = useStore();

  return (
    <div className="py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Certifications</h1>
          <p className={cn(
            'text-lg max-w-2xl mx-auto',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            Professional certifications validating my expertise and commitment to continuous learning
          </p>
        </motion.div>

        {/* Certifications Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {certifications.map((cert, index) => (
            <motion.div
              key={cert.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                'rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-xl',
                theme === 'dark' 
                  ? 'bg-gray-800 hover:shadow-indigo-500/10' 
                  : 'bg-white shadow-lg hover:shadow-gray-300'
              )}
            >
              {/* Certificate Image */}
              <div className="relative h-48 overflow-hidden">
                <img
                  src={cert.imageUrl}
                  alt={cert.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="flex items-center text-white/80 text-sm">
                    <Building2 className="w-4 h-4 mr-2" />
                    {cert.organization}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-6">
                <div className="flex items-center text-sm mb-3">
                  <Calendar className={cn(
                    'w-4 h-4 mr-2',
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  )} />
                  <span className={cn(
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-500'
                  )}>
                    Issued {new Date(cert.issueDate).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                    })}
                  </span>
                </div>

                <h3 className="text-xl font-semibold mb-3">{cert.title}</h3>
                
                <p className={cn(
                  'text-sm mb-4',
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                )}>
                  {cert.description}
                </p>

                {/* Actions */}
                <div className="flex flex-wrap gap-3">
                  {cert.verificationUrl && (
                    <a
                      href={cert.verificationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={cn(
                        'inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                        'bg-gradient-to-r from-indigo-500 to-purple-600 text-white hover:shadow-lg hover:shadow-indigo-500/25'
                      )}
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Verify
                    </a>
                  )}
                  {cert.pdfUrl && (
                    <a
                      href={cert.pdfUrl}
                      download
                      className={cn(
                        'inline-flex items-center px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                        theme === 'dark'
                          ? 'bg-gray-700 text-gray-300 hover:bg-gray-600'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      )}
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Download PDF
                    </a>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {certifications.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={cn(
              'text-center py-16 rounded-2xl',
              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
            )}
          >
            <FileText className={cn(
              'w-16 h-16 mx-auto mb-4',
              theme === 'dark' ? 'text-gray-600' : 'text-gray-400'
            )} />
            <p className={cn(
              'text-lg',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              No certifications to display yet
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
