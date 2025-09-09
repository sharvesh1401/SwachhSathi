import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import Navigation from '@/components/Navigation';
import LanguageToggle from '@/components/LanguageToggle';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

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
        {/* App Name and Tagline */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center mb-8"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-2">
            SwachhSathi
          </h1>
          <p className="text-lg text-muted-foreground">
            Act today for a cleaner tomorrow.
          </p>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="text-center mb-6"
        >
          <h2 className="text-2xl md:text-3xl font-bold text-foreground mb-2">
            Your Household QR
          </h2>
        </motion.div>

        {/* QR Code Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ 
            duration: 1,
            ease: "easeOut",
            delay: 0.4
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
            className="relative bg-white p-6 rounded-3xl shadow-2xl border border-border/20"
          >
            <QRCodeSVG
              value={householdId}
              size={250}
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

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.6 }}
          className="flex gap-4 mt-8"
        >
          <Link to="/dashboard">
            <Button variant="outline" size="lg" className="font-semibold">Dashboard</Button>
          </Link>
          <Link to="/map">
            <Button size="lg" className="font-semibold btn-primary">Maps</Button>
          </Link>
        </motion.div>

        {/* Footer */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ 
            duration: 0.8,
            ease: "easeOut",
            delay: 0.8
          }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground text-sm">
            Made by{' '}
            <a
              href="https://sharveshfolio.netlify.app"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-accent hover:underline"
            >
              Sharvesh
            </a>
            {' '}and Team
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