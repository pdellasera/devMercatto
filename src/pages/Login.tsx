import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Mail, Lock, AlertCircle } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { Button } from '../design-system/components/Button/Button';
import { Input } from '../components/ui/Input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../design-system/components/Card/Card';
import { Logo } from '../components/ui/Logo';


export const Login: React.FC = () => {
  const { login, isLoading, error, clearError } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (error) clearError();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      return;
    }

    try {
      await login({
        email: formData.email,
        password: formData.password,
      });
    } catch (error) {
      // Error is handled by the useAuth hook
      console.error('Login error:', error);
    }
  };

  const containerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.5,
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { opacity: 1, y: 0 },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-neutral-50 flex items-center justify-center p-4">
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <Card className="shadow-xl">
          <CardHeader className="text-center pb-6">
            <motion.div variants={itemVariants} className="mb-4">
              <div className="flex justify-center mb-4">
                <Logo size="lg" showText={true} />
              </div>
              <CardTitle className="text-2xl font-bold text-neutral-900">
                Bienvenido a Mercatto
              </CardTitle>
            </motion.div>
            <motion.div variants={itemVariants}>
              <CardDescription className="text-neutral-600">
                Inicia sesión en tu cuenta para acceder al panel de prospectos
              </CardDescription>
            </motion.div>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <motion.div variants={itemVariants}>
                <Input
                  label="Email Address"
                  type="email"
                  placeholder="Enter your email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  leftIcon={<Mail className="w-4 h-4" />}
                  required
                  disabled={isLoading}
                />
              </motion.div>

              <motion.div variants={itemVariants}>
                <Input
                  label="Password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  leftIcon={<Lock className="w-4 h-4" />}
                  rightIcon={
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-neutral-500 hover:text-neutral-700"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  }
                  required
                  disabled={isLoading}
                />
              </motion.div>

              {error && (
                <motion.div
                  variants={itemVariants}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center space-x-2 p-3 bg-error-50 border border-error-200 rounded-lg"
                >
                  <AlertCircle className="w-4 h-4 text-error-500 flex-shrink-0" />
                  <span className="text-sm text-error-700">{error}</span>
                </motion.div>
              )}

              <motion.div variants={itemVariants}>
                <Button
                  type="submit"
                  variant="primary"
                  size="lg"
                  className="w-full"
                  disabled={isLoading || !formData.email || !formData.password}
                >
                  {isLoading ? 'Signing in...' : 'Sign In'}
                </Button>
              </motion.div>

              <motion.div variants={itemVariants} className="text-center">
                <a
                  href="#forgot-password"
                  className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                  Forgot your password?
                </a>
              </motion.div>
            </form>
          </CardContent>
        </Card>

        <motion.div
          variants={itemVariants}
          className="mt-8 text-center text-sm text-neutral-600"
        >
          <p>
            Don't have an account?{' '}
            <a
              href="#signup"
              className="text-primary-600 hover:text-primary-700 font-medium"
            >
              Contact your administrator
            </a>
          </p>
        </motion.div>
      </motion.div>
    </div>
  );
};
