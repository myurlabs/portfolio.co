import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
import { useStore } from '@/store/useStore';
import { cn } from '@/utils/cn';

export function LoginPage() {
  const { theme, isAuthenticated, login } = useStore();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (isAuthenticated) {
    return <Navigate to="/admin" />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate network delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    const success = login(password);
    setIsLoading(false);

    if (success) {
      navigate('/admin');
    } else {
      setError('Invalid password. Try "admin123"');
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-12">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md px-4"
      >
        <div className={cn(
          'p-8 rounded-2xl',
          theme === 'dark' ? 'bg-gray-800' : 'bg-white shadow-xl'
        )}>
          {/* Header */}
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-r from-indigo-500 to-purple-600 flex items-center justify-center mx-auto mb-4">
              <Lock className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold mb-2">Admin Login</h1>
            <p className={cn(
              'text-sm',
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              Enter your password to access the dashboard
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className={cn(
                'block text-sm font-medium mb-2',
                theme === 'dark' ? 'text-gray-300' : 'text-gray-700'
              )}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter admin password"
                  className={cn(
                    'w-full px-4 py-3 pr-12 rounded-xl border-2 transition-all duration-200 focus:outline-none',
                    theme === 'dark'
                      ? 'bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-indigo-500'
                      : 'bg-white border-gray-200 text-gray-900 placeholder-gray-400 focus:border-indigo-500',
                    error && 'border-red-500'
                  )}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className={cn(
                    'absolute right-3 top-1/2 -translate-y-1/2 p-1 rounded-lg transition-colors',
                    theme === 'dark'
                      ? 'text-gray-400 hover:text-white hover:bg-gray-600'
                      : 'text-gray-400 hover:text-gray-600 hover:bg-gray-100'
                  )}
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Error */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center p-3 rounded-xl bg-red-500/10 text-red-500"
              >
                <AlertCircle className="w-5 h-5 mr-2 shrink-0" />
                <p className="text-sm">{error}</p>
              </motion.div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={isLoading || !password}
              className={cn(
                'w-full flex items-center justify-center px-6 py-3 rounded-xl font-medium text-white transition-all duration-300',
                isLoading || !password
                  ? 'bg-gray-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-indigo-500 to-purple-600 hover:shadow-lg hover:shadow-indigo-500/25'
              )}
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Signing in...
                </>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          {/* Hint */}
          <div className={cn(
            'mt-6 p-4 rounded-xl text-center text-sm',
            theme === 'dark' ? 'bg-gray-700/50' : 'bg-gray-100'
          )}>
            <p className={cn(
              theme === 'dark' ? 'text-gray-400' : 'text-gray-600'
            )}>
              Apna admin password dalein jo setup ke waqt set kiya tha
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
