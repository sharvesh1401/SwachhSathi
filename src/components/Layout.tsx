import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';

interface LayoutProps {
  children: React.ReactNode;
  showFooter?: boolean;
}

const Layout: React.FC<LayoutProps> = ({ children, showFooter = true }) => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen flex flex-col relative overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 -z-10">
        <div className="animated-bg absolute inset-0 opacity-10" />
        <div className="absolute inset-0 bg-gradient-to-br from-background/90 to-background/95" />
      </div>

      {/* Main Content */}
      <main className="flex-1 relative z-10">
        {children}
      </main>

      {/* Footer */}
      {showFooter && (
        <motion.footer 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 text-center text-xs text-muted-foreground z-10"
        >
          <span>{t('home.footer').split('Sharvesh')[0]}</span>
          <a 
            href="https://sharveshfolio.netlify.app" 
            target="_blank" 
            rel="noopener noreferrer"
            className="text-accent hover:text-accent/80 transition-colors underline font-medium"
          >
            Sharvesh
          </a>
          <span>{t('home.footer').split('Sharvesh')[1]}</span>
        </motion.footer>
      )}
    </div>
  );
};

export default Layout;