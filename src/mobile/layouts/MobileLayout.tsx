import React from 'react';
import { Outlet } from 'react-router-dom';
import { motion } from 'framer-motion';
import { MobileHeader } from './MobileHeader';

export const MobileLayout: React.FC = () => {
  return (
    <div className="min-h-screen bg-[#141414] flex flex-col">
      {/* Sticky Header */}
      <div className="sticky top-0 z-50">
        <MobileHeader />
      </div>

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


