import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Camera, QrCode, Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import Layout from '@/components/Layout';
import Navigation from '@/components/Navigation';
import LanguageToggle from '@/components/LanguageToggle';
import QRScanner from '@/components/QRScanner';
import { QRCodeSVG } from 'qrcode.react';

const HomeScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showScanner, setShowScanner] = useState(false);
  const [showManualEntry, setShowManualEntry] = useState(false);
  const [manualCode, setManualCode] = useState('');
  
  // Generate a demo QR code value
  const qrValue = 'SWACHH-USER-' + Math.random().toString(36).substr(2, 9).toUpperCase();

  const handleQRScan = (result: string | null) => {
    if (result) {
      console.log('QR Scanned:', result);
      setShowScanner(false);
      // Store the scanned result and navigate to dashboard
      localStorage.setItem('swachh-qr-code', result);
      navigate('/dashboard');
    }
  };

  const handleManualEntry = () => {
    if (manualCode.trim()) {
      localStorage.setItem('swachh-qr-code', manualCode.trim());
      setShowManualEntry(false);
      navigate('/dashboard');
    }
  };

  return (
    <Layout>
      <Navigation />
      <LanguageToggle />
      
      <div className="min-h-screen flex flex-col items-center justify-center p-6">
        {/* App Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary via-accent to-primary bg-clip-text text-transparent mb-4">
            {t('app.name')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('app.tagline')}
          </p>
        </motion.div>

        {/* Demo QR Code Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="card-gradient mb-8 flex flex-col items-center max-w-sm mx-auto"
        >
          <h2 className="text-xl font-semibold mb-6 text-center">
            {t('home.title')}
          </h2>
          
          {/* QR Code with breathing animation */}
          <motion.div
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            className="bg-white p-4 rounded-2xl shadow-lg"
          >
            <QRCodeSVG
              value={qrValue}
              size={200}
              level="M"
              includeMargin={true}
              fgColor="#1e293b"
              bgColor="#ffffff"
            />
          </motion.div>
          
          <p className="text-sm text-muted-foreground mt-4 text-center max-w-xs">
            {t('home.subtitle')}
          </p>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4 w-full max-w-sm"
        >
          {/* Scan QR Button */}
          <Dialog open={showScanner} onOpenChange={setShowScanner}>
            <DialogTrigger asChild>
              <Button className="btn-primary w-full text-lg h-14 shadow-lg">
                <Camera className="w-6 h-6 mr-3" />
                {t('home.scanButton')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm bg-card/95 backdrop-blur-md border border-border/50">
              <DialogHeader>
                <DialogTitle className="text-center">{t('home.title')}</DialogTitle>
              </DialogHeader>
              <QRScanner onScan={handleQRScan} />
            </DialogContent>
          </Dialog>

          {/* Manual Entry Button */}
          <Dialog open={showManualEntry} onOpenChange={setShowManualEntry}>
            <DialogTrigger asChild>
              <Button variant="outline" className="w-full h-12 border-2 hover:bg-accent/10">
                <Keyboard className="w-5 h-5 mr-3" />
                {t('home.manualEntry')}
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-sm bg-card/95 backdrop-blur-md border border-border/50">
              <DialogHeader>
                <DialogTitle className="text-center">{t('home.manualEntry')}</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  placeholder="Enter QR code..."
                  value={manualCode}
                  onChange={(e) => setManualCode(e.target.value)}
                  className="h-12"
                />
                <Button 
                  onClick={handleManualEntry}
                  className="w-full h-12"
                  disabled={!manualCode.trim()}
                >
                  Continue
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Demo Navigation - for testing */}
          <Button
            onClick={() => navigate('/dashboard')}
            variant="ghost"
            className="w-full text-accent hover:text-accent/80 hover:bg-accent/10"
          >
            <QrCode className="w-4 h-4 mr-2" />
            Continue to Dashboard (Demo)
          </Button>
        </motion.div>
      </div>
    </Layout>
  );
};

export default HomeScreen;