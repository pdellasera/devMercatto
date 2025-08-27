import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MobileHeader } from './MobileHeader';
import { MobileSidebar } from './MobileSidebar';
import { useTheme } from '../../design-system/theme/ThemeProvider';
import { cn } from '../utils/cn';

export const MobileLayout: React.FC = () => {
  const { resolvedTheme } = useTheme();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleMenuToggle = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const handleSidebarClose = () => {
    setSidebarOpen(false);
  };

  return (
    <div className={cn(
      "min-h-screen flex flex-col overflow-x-hidden",
      resolvedTheme === 'light' ? "bg-[#f5f5f5]" : "bg-[#141414]"
    )}>
      {/* Fixed Header */}
      <div className="fixed top-0 inset-x-0 z-50">
        <MobileHeader 
          onMenuToggle={handleMenuToggle}
          sidebarOpen={sidebarOpen}
        />
      </div>

      {/* Spacer para compensar la altura del header */}
      <div className="h-16" />

      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={sidebarOpen}
        onClose={handleSidebarClose}
      />

      {/* Main Content - Ocupa toda la pantalla */}
      <main className="flex-1 w-full h-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="w-full h-full"
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default MobileLayout;


