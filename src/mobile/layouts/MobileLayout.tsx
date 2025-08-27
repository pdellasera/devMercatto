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
      "min-h-screen flex flex-col",
      resolvedTheme === 'light' ? "bg-[#f5f5f5]" : "bg-[#141414]"
    )}>
      {/* Sticky Header */}
      <div className="sticky top-0 z-50">
        <MobileHeader 
          onMenuToggle={handleMenuToggle}
          sidebarOpen={sidebarOpen}
        />
      </div>

      {/* Mobile Sidebar */}
      <MobileSidebar 
        isOpen={sidebarOpen}
        onClose={handleSidebarClose}
      />

      <div className="flex flex-1">
        {/* Main Content */}
        <main className="flex-1">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="p-4 sm:p-6 lg:p-8"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>
    </div>
  );
};

export default MobileLayout;


