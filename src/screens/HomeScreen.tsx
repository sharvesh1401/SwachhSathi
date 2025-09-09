import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import Navigation from '@/components/Navigation';
import LanguageToggle from '@/components/LanguageToggle';
import { QRCodeSVG } from 'qrcode.react';

const HomeScreen = () => {
  const { t } = useTranslation();
  
  // Generate a unique QR code for the household
  const householdId = 'HOUSEHOLD-' + Math.random().toString(36).substr(2, 9).toUpperCase();

  return (
    <Layout showFooter={false}>
      <Navigation />
      <LanguageToggle />
      
      {/* Interactive Background */}
      <div className="fixed inset-0 interactive-bg opacity-20 -z-10" />
      
      <div className="min-h-screen flex flex-col items-center justify-center p-6 relative">
        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-2">
            Your Household QR
          </h1>
        </motion.div>

        {/* QR Code Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 1,
            ease: "easeOut",
            delay: 0.3
          }}
          className="relative"
        >
          {/* Glow Effect */}
          <motion.div
            animate={{ 
              scale: [1, 1.05, 1],
              opacity: [0.3, 0.6, 0.3]
            }}
            transition={{ 
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="absolute inset-0 bg-accent/20 rounded-3xl blur-xl"
          />
          
          {/* QR Code */}
          <motion.div
            animate={{ 
              scale: [1, 1.02, 1]
            }}
            transition={{ 
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="relative bg-white p-8 rounded-3xl shadow-2xl border border-border/20"
          >
            <QRCodeSVG
              value={householdId}
              size={280}
              level="M"
              includeMargin={true}
              fgColor="#2d3748"
              bgColor="#ffffff"
              imageSettings={{
                src: "",
                x: undefined,
                y: undefined,
                height: 0,
                width: 0,
                excavate: false,
              }}
            />
          </motion.div>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8,
            ease: "easeOut",
            delay: 0.6
          }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground text-sm">
            Made by Sharvesh and Team
          </p>
        </motion.div>

        {/* Floating Elements for Visual Interest */}
        <motion.div
          animate={{ 
            y: [0, -20, 0],
            rotate: [0, 5, 0]
          }}
          transition={{ 
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          className="absolute top-20 left-10 w-4 h-4 bg-success/30 rounded-full blur-sm"
        />
        
        <motion.div
          animate={{ 
            y: [0, 15, 0],
            rotate: [0, -3, 0]
          }}
          transition={{ 
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2
          }}
          className="absolute bottom-32 right-16 w-6 h-6 bg-accent/20 rounded-full blur-sm"
        />
        
        <motion.div
          animate={{ 
            y: [0, -10, 0],
            rotate: [0, 2, 0]
          }}
          transition={{ 
            duration: 7,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 4
          }}
          className="absolute top-1/3 right-8 w-3 h-3 bg-warning/40 rounded-full blur-sm"
        />
      </div>
    </Layout>
  );
};

export default HomeScreen;