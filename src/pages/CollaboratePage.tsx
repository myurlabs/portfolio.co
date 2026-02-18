import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, CheckCircle, Mail, User, Briefcase, DollarSign, MessageSquare, AlertTriangle, XCircle } from 'lucide-react';
import emailjs from '@emailjs/browser';
import { useStore } from '@/store/useStore';
import { cn } from '@/utils/cn';

const collaborationSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email'),
  projectType: z.string().min(1, 'Please select a project type'),
  budgetRange: z.string().min(1, 'Please select a budget range'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

type CollaborationFormData = z.infer<typeof collaborationSchema>;

const projectTypes = [
  'Web Application',
  'Mobile Application',
  'Windows Administration',
  'Cloud Infrastructure',
  'Security Audit',
  'Consulting',
  'Other',
];

const budgetRanges = [
  'Under $1,000',
  '$1,000 - $5,000',
  '$5,000 - $10,000',
  '$10,000 - $25,000',
  '$25,000+',
  'Not sure yet',
];

export function CollaboratePage() {
  const { theme, profile, emailConfig, addCollaborationRequest } = useStore();
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [emailStatus, setEmailStatus] = useState<'none' | 'sent' | 'failed'>('none');
  const [errorDetail, setErrorDetail] = useState('');

  const isEmailConfigured = !!(emailConfig?.serviceId && emailConfig?.templateId && emailConfig?.publicKey);

  // Initialize EmailJS when config is available
  useEffect(() => {
    if (isEmailConfigured && emailConfig.publicKey) {
      try {
        emailjs.init(emailConfig.publicKey);
        console.log('✅ EmailJS initialized successfully with key:', emailConfig.publicKey.substring(0, 5) + '...');
      } catch (err) {
        console.error('❌ EmailJS init failed:', err);
      }
    }
  }, [emailConfig.publicKey, isEmailConfigured]);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<CollaborationFormData>({
    resolver: zodResolver(collaborationSchema),
  });

  const onSubmit = async (data: CollaborationFormData) => {
    setIsSubmitting(true);
    setEmailStatus('none');
    setErrorDetail('');
    
    // Save to store first (this always works)
    addCollaborationRequest(data);
    
    // Try to send email if configured
    if (isEmailConfigured) {
      try {
        console.log('📧 Sending email via EmailJS...');
        console.log('Service ID:', emailConfig.serviceId);
        console.log('Template ID:', emailConfig.templateId);
        console.log('Public Key:', emailConfig.publicKey.substring(0, 5) + '...');

        // These template parameters must match your EmailJS template
        const templateParams = {
          // Sender info
          from_name: data.name,
          from_email: data.email,
          reply_to: data.email,
          
          // Project details
          project_type: data.projectType,
          budget_range: data.budgetRange,
          message: data.message,
          
          // Admin info
          to_name: profile.name || 'Admin',
          to_email: profile.email || '',
          
          // Extra fields (some templates use these)
          user_name: data.name,
          user_email: data.email,
          subject: `New Collaboration Request from ${data.name}`,
        };

        console.log('📋 Template params:', templateParams);

        const result = await emailjs.send(
          emailConfig.serviceId,
          emailConfig.templateId,
          templateParams,
          emailConfig.publicKey  // Pass public key again for safety
        );

        console.log('✅ EmailJS Response:', result);
        
        if (result.status === 200) {
          setEmailStatus('sent');
          console.log('✅ Email sent successfully!');
        } else {
          setEmailStatus('failed');
          setErrorDetail(`Status: ${result.status}, Text: ${result.text}`);
        }
      } catch (error: any) {
        console.error('❌ EmailJS Error:', error);
        setEmailStatus('failed');
        setErrorDetail(error?.text || error?.message || 'Unknown error occurred');
      }
    } else {
      console.log('⚠️ Email not configured. Message saved to store only.');
      setEmailStatus('none');
    }
    
    setIsSubmitting(false);
    setIsSubmitted(true);
    reset();
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
    <div className="py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl sm:text-5xl font-bold mb-4">Let's Collaborate</h1>
          <p className={cn(
            'text-lg max-w-2xl mx-auto',
            theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
          )}>
            Have a project in mind? I'd love to hear about it. Fill out the form below and I'll get back to you as soon as possible.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Contact Info */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-1"
          >
            <div className={cn(
              'p-6 rounded-2xl',
              theme === 'dark' ? 'bg-gray-800' : 'bg-gray-100'
            )}>
              <h2 className="text-xl font-semibold mb-6">Get in Touch</h2>
              
              <div className="space-y-4">
                {profile.email && (
                  <div className="flex items-start">
                    <div className={cn(
                      'w-10 h-10 rounded-xl flex items-center justify-center shrink-0',
                      'bg-gradient-to-r from-indigo-500 to-purple-600'
                    )}>
                      <Mail className="w-5 h-5 text-white" />
                    </div>
                    <div className="ml-4">
                      <p className="font-medium">Email</p>
                      <a
                        href={`mailto:${profile.email}`}
                        className={cn(
                          'text-sm hover:text-indigo-500 transition-colors break-all',
                          theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                        )}
                      >
                        {profile.email}
                      </a>
                    </div>
                  </div>
                )}
              </div>

              <div className={cn(
                'mt-8 pt-8 border-t',
                theme === 'dark' ? 'border-gray-700' : 'border-gray-200'
              )}>
                <h3 className="font-medium mb-4">What to expect:</h3>
                <ul className={cn(
                  'space-y-3 text-sm',
                  theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                )}>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 shrink-0" />
                    Response within 24-48 hours
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 shrink-0" />
                    Free initial consultation
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 shrink-0" />
                    Detailed project proposal
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-5 h-5 text-green-500 mr-2 shrink-0" />
                    Transparent pricing
                  </li>
                </ul>
              </div>
            </div>
          </motion.div>

          {/* Form */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.3 }}
            className="lg:col-span-2"
          >
            <AnimatePresence mode="wait">
              {isSubmitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className={cn(
                    'p-8 rounded-2xl text-center',
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-lg'
                  )}
                >
                  {/* Success or partial success */}
                  <div className={cn(
                    'w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6',
                    emailStatus === 'failed'
                      ? 'bg-gradient-to-r from-amber-400 to-orange-500'
                      : 'bg-gradient-to-r from-green-400 to-emerald-500'
                  )}>
                    {emailStatus === 'failed' ? (
                      <AlertTriangle className="w-10 h-10 text-white" />
                    ) : (
                      <CheckCircle className="w-10 h-10 text-white" />
                    )}
                  </div>
                  
                  <h2 className="text-2xl font-bold mb-4">
                    {emailStatus === 'sent' 
                      ? '✅ Message Sent Successfully!' 
                      : emailStatus === 'failed'
                        ? '⚠️ Message Saved (Email Issue)'
                        : '📨 Message Received!'}
                  </h2>

                  {/* Email sent success */}
                  {emailStatus === 'sent' && (
                    <div className="mb-4 p-4 rounded-lg bg-green-100 text-green-800">
                      <CheckCircle className="w-5 h-5 inline mr-2" />
                      <strong>Email successfully delivered!</strong>
                      <p className="text-sm mt-1">Admin ko email notification bhej di gayi hai.</p>
                    </div>
                  )}

                  {/* Email failed */}
                  {emailStatus === 'failed' && (
                    <div className="mb-4 p-4 rounded-lg bg-amber-100 text-amber-800">
                      <AlertTriangle className="w-5 h-5 inline mr-2" />
                      <strong>Email bhejne mein issue aayi</strong>
                      <p className="text-sm mt-1">
                        Aapka message save ho gaya hai. Admin dashboard mein dikh jayega.
                      </p>
                      {errorDetail && (
                        <p className="text-xs mt-2 bg-amber-200 p-2 rounded">
                          Error: {errorDetail}
                        </p>
                      )}
                    </div>
                  )}

                  {/* Email not configured */}
                  {emailStatus === 'none' && !isEmailConfigured && (
                    <div className="mb-4 p-4 rounded-lg bg-blue-100 text-blue-800">
                      <Mail className="w-5 h-5 inline mr-2" />
                      <strong>Message saved successfully!</strong>
                      <p className="text-sm mt-1">Admin will see your request in their dashboard.</p>
                    </div>
                  )}

                  <p className={cn(
                    'mb-6',
                    theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
                  )}>
                    Thank you for reaching out! I'll review your message and get back to you within 24-48 hours.
                  </p>
                  <button
                    onClick={() => {
                      setIsSubmitted(false);
                      setEmailStatus('none');
                      setErrorDetail('');
                    }}
                    className="inline-flex items-center px-6 py-3 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 text-white font-medium hover:shadow-lg hover:shadow-indigo-500/25 transition-all duration-300"
                  >
                    Send Another Message
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onSubmit={handleSubmit(onSubmit)}
                  className={cn(
                    'p-8 rounded-2xl',
                    theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-lg'
                  )}
                >
                  <div className="grid sm:grid-cols-2 gap-6 mb-6">
                    {/* Name */}
                    <div>
                      <label className={labelClasses}>
                        <User className="w-4 h-4 inline mr-2" />
                        Your Name
                      </label>
                      <input
                        {...register('name')}
                        type="text"
                        placeholder="Your full name"
                        className={inputClasses}
                      />
                      {errors.name && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <XCircle className="w-3 h-3 mr-1" />
                          {errors.name.message}
                        </p>
                      )}
                    </div>

                    {/* Email */}
                    <div>
                      <label className={labelClasses}>
                        <Mail className="w-4 h-4 inline mr-2" />
                        Email Address
                      </label>
                      <input
                        {...register('email')}
                        type="email"
                        placeholder="your@email.com"
                        className={inputClasses}
                      />
                      {errors.email && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <XCircle className="w-3 h-3 mr-1" />
                          {errors.email.message}
                        </p>
                      )}
                    </div>

                    {/* Project Type */}
                    <div>
                      <label className={labelClasses}>
                        <Briefcase className="w-4 h-4 inline mr-2" />
                        Project Type
                      </label>
                      <select {...register('projectType')} className={inputClasses}>
                        <option value="">Select a project type</option>
                        {projectTypes.map((type) => (
                          <option key={type} value={type}>{type}</option>
                        ))}
                      </select>
                      {errors.projectType && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <XCircle className="w-3 h-3 mr-1" />
                          {errors.projectType.message}
                        </p>
                      )}
                    </div>

                    {/* Budget */}
                    <div>
                      <label className={labelClasses}>
                        <DollarSign className="w-4 h-4 inline mr-2" />
                        Budget Range
                      </label>
                      <select {...register('budgetRange')} className={inputClasses}>
                        <option value="">Select your budget</option>
                        {budgetRanges.map((range) => (
                          <option key={range} value={range}>{range}</option>
                        ))}
                      </select>
                      {errors.budgetRange && (
                        <p className="text-red-500 text-sm mt-1 flex items-center">
                          <XCircle className="w-3 h-3 mr-1" />
                          {errors.budgetRange.message}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Message */}
                  <div className="mb-6">
                    <label className={labelClasses}>
                      <MessageSquare className="w-4 h-4 inline mr-2" />
                      Project Details
                    </label>
                    <textarea
                      {...register('message')}
                      rows={5}
                      placeholder="Tell me about your project, goals, and timeline..."
                      className={inputClasses}
                    />
                    {errors.message && (
                      <p className="text-red-500 text-sm mt-1 flex items-center">
                        <XCircle className="w-3 h-3 mr-1" />
                        {errors.message.message}
                      </p>
                    )}
                  </div>

                  {/* Submit */}
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className={cn(
                      'w-full flex items-center justify-center px-6 py-4 rounded-xl font-medium text-white transition-all duration-300',
                      isSubmitting
                        ? 'bg-gray-500 cursor-not-allowed'
                        : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/25 hover:scale-[1.02]'
                    )}
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Sending your message...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5 mr-2" />
                        Send Message
                      </>
                    )}
                  </button>

                  {/* Email status info */}
                  <p className={cn(
                    'text-xs text-center mt-3',
                    theme === 'dark' ? 'text-gray-500' : 'text-gray-400'
                  )}>
                    {isEmailConfigured 
                      ? '🟢 Email notifications active - You will receive a confirmation'
                      : '📨 Your message will be saved and reviewed by admin'}
                  </p>
                </motion.form>
              )}
            </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
