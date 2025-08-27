import React from 'react';
import { motion } from 'framer-motion';
import { Header } from './Header';
import { Sidebar } from './Sidebar';
import { useSidebar } from '../../hooks/useSidebar';
import { useTheme } from '../../design-system/theme/ThemeProvider';
import { cn } from '../../utils/cn';

interface MainLayoutProps {
  children: React.ReactNode;
  showSearch?: boolean;
  showAddButton?: boolean;
  onSearch?: (query: string) => void;
  onAddProspect?: () => void;
}

export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  showSearch = true,
  showAddButton = true,
  onSearch,
  onAddProspect,
}) => {
  const { isOpen: sidebarOpen, toggle: handleMenuToggle, close: handleSidebarClose } = useSidebar();
  const { resolvedTheme } = useTheme();

  return (
    <div className={cn(
      "min-h-screen flex flex-col",
      resolvedTheme === 'light' ? "bg-[#f5f5f5]" : "bg-[#141414]"
    )}>
      {/* Sticky Header */}
      <div className="sticky top-0 z-50">
        <Header
          onMenuToggle={handleMenuToggle}
          onSearch={onSearch}
          onAddProspect={onAddProspect}
          showSearch={showSearch}
          showAddButton={showAddButton}
          sidebarOpen={sidebarOpen}
        />
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
            {children}
          </motion.div>
        </main>
      </div>

      {/* Sidebar as Modal Overlay */}
      <Sidebar isOpen={sidebarOpen} onClose={handleSidebarClose} />
    </div>
  );
};
