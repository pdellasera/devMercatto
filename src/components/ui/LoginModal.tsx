import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Eye, EyeOff, User, LogIn } from 'lucide-react';
import { Button } from '../../design-system';
import { cn } from '../../utils/cn';

interface LoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLogin?: (email: string, password: string) => void;
  onRegister?: (email: string, password: string, name: string) => void;
}

export const LoginModal: React.FC<LoginModalProps> = ({
  isOpen,
  onClose,
  onLogin,
  onRegister,
}) => {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (isLogin) {
      onLogin?.(formData.email, formData.password);
    } else {
      onRegister?.(formData.email, formData.password, formData.name);
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
            className="relative w-full max-w-md sm:max-w-lg md:max-w-xl min-w-[420px]"
            onClick={(e) => e.stopPropagation()}
          >
                         {/* Modal Content */}
             <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl">
               {/* Animated background gradient */}  
               <motion.div
                 className="absolute inset-0 bg-gradient-to-br from-primary/10 via-primary/5 to-primary/10"
                 animate={{
                   background: [
                     "linear-gradient(135deg, rgba(0, 200, 83, 0.1) 0%, rgba(0, 200, 83, 0.05) 50%, rgba(0, 200, 83, 0.1) 100%)",
                     "linear-gradient(135deg, rgba(0, 200, 83, 0.05) 0%, rgba(0, 200, 83, 0.1) 50%, rgba(0, 200, 83, 0.05) 100%)",
                     "linear-gradient(135deg, rgba(0, 200, 83, 0.1) 0%, rgba(0, 200, 83, 0.05) 50%, rgba(0, 200, 83, 0.1) 100%)",
                   ],
                 }}
                 transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
               />

              <div className="relative z-10 p-6 sm:p-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-6">
                                     <div className="flex items-center space-x-3">
                     <div className="w-10 h-10 bg-gradient-to-br from-primary to-primary-hover rounded-xl flex items-center justify-center">
                       <LogIn className="w-5 h-5 text-white" />
                     </div>
                    <div>
                      <h2 className="text-xl font-bold text-white">
                        {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                      </h2>
                      <p className="text-sm text-gray-400">
                        {isLogin ? 'Accede a tu cuenta de Mercatto' : 'Únete a Mercatto'}
                      </p>
                    </div>
                  </div>
                  
                  <motion.button
                    onClick={onClose}
                    className="p-2 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <X className="w-5 h-5" />
                  </motion.button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="space-y-5">
                  {!isLogin && (
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">
                        Nombre completo
                      </label>
                      <div className="relative">
                                                                         <input
                          type="text"
                          placeholder="Tu nombre completo"
                          value={formData.name}
                          onChange={(e) => handleInputChange('name', e.target.value)}
                          className="w-full pl-10 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200 text-sm"
                          required={!isLogin}
                        />
                        <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      </div>
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Correo electrónico
                    </label>
                    <div className="relative">
                                                                   <input
                        type="email"
                        placeholder="tu@email.com"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        className="w-full pl-10 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200 text-sm"
                        required
                      />
                      <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Contraseña
                    </label>
                    <div className="relative">
                                                                   <input
                        type={showPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        value={formData.password}
                        onChange={(e) => handleInputChange('password', e.target.value)}
                        className="w-full pl-10 pr-10 py-3.5 bg-white/5 border border-white/10 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary/50 transition-all duration-200 text-sm"
                        required
                      />
                      <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <motion.button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white transition-colors"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </motion.button>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <motion.div
                    className="pt-6"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                                         <Button
                       type="submit"
                       variant="primary"
                       size="lg"
                       className="w-full glass-button bg-gradient-to-r from-primary to-primary-hover hover:from-primary-hover hover:to-primary text-white font-semibold shadow-lg shadow-primary/25 py-4 text-base"
                     >
                      {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
                    </Button>
                  </motion.div>
                </form>

                {/* Toggle Mode */}
                <div className="mt-6 text-center">
                  <p className="text-sm text-gray-400">
                    {isLogin ? '¿No tienes cuenta?' : '¿Ya tienes cuenta?'}
                                         <motion.button
                       type="button"
                       onClick={() => setIsLogin(!isLogin)}
                       className="ml-1 text-primary hover:text-primary-hover font-medium transition-colors"
                       whileHover={{ scale: 1.05 }}
                       whileTap={{ scale: 0.95 }}
                     >
                      {isLogin ? 'Crear cuenta' : 'Iniciar sesión'}
                    </motion.button>
                  </p>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
