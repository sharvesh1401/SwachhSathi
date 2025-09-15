import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import LanguageToggle from '@/components/LanguageToggle';
import { Button } from '@/components/ui/button';
import { Home, Store } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const HomeScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleLogin = (userType: 'household' | 'commercial') => {
    localStorage.setItem('userType', userType);
    navigate('/dashboard');
  };

  return (
    <Layout showFooter={true}>
      {/* Language Toggle positioned at top-right */}
      <div className="absolute top-4 right-4 z-10">
        <LanguageToggle />
      </div>
      
      {/* Interactive Background */}
      <div className="fixed inset-0 interactive-bg opacity-20 -z-10" />
      
      <div className="min-h-screen flex flex-col items-center justify-center p-4 sm:p-6 relative text-center">
        {/* App Name and Tagline */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-10"
        >
          <h1 className="text-5xl md:text-6xl font-bold text-primary mb-2">
            {t('app.name')}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t('app.tagline')}
          </p>
        </motion.div>

        {/* Login Options */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="w-full max-w-md"
        >
          <Card className="card-gradient shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl font-bold">{t('home.loginTitle')}</CardTitle>
              <CardDescription>{t('home.loginDescription')}</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col sm:flex-row gap-4">
              {/* Household Login */}
              <Dialog>
                <DialogTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1"
                  >
                    <Button className="w-full h-24 text-lg font-semibold btn-primary flex-col gap-2">
                      <Home size={28} />
                      {t('home.householdUser')}
                    </Button>
                  </motion.div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{t('home.householdLogin')}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="aadhaar" className="text-right">
                        {t('home.aadhaarNumber')}
                      </Label>
                      <Input id="aadhaar" placeholder="XXXX XXXX XXXX" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">{t('home.otp')}</Label>
                      <div className="col-span-3">
                        <InputOTP maxLength={6}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </div>
                  </div>
                  <Button onClick={() => handleLogin('household')} className="w-full btn-primary">
                    {t('home.login')}
                  </Button>
                </DialogContent>
              </Dialog>

              {/* Commercial Login */}
              <Dialog>
                <DialogTrigger asChild>
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex-1"
                  >
                    <Button variant="outline" className="w-full h-24 text-lg font-semibold flex-col gap-2 border-2 border-primary">
                      <Store size={28} />
                      {t('home.commercialUser')}
                    </Button>
                  </motion.div>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[425px]">
                  <DialogHeader>
                    <DialogTitle>{t('home.commercialLogin')}</DialogTitle>
                  </DialogHeader>
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label htmlFor="gst" className="text-right">
                        {t('home.gstNumber')}
                      </Label>
                      <Input id="gst" placeholder="22AAAAA0000A1Z5" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                      <Label className="text-right">{t('home.otp')}</Label>
                      <div className="col-span-3">
                        <InputOTP maxLength={6}>
                          <InputOTPGroup>
                            <InputOTPSlot index={0} />
                            <InputOTPSlot index={1} />
                            <InputOTPSlot index={2} />
                            <InputOTPSlot index={3} />
                            <InputOTPSlot index={4} />
                            <InputOTPSlot index={5} />
                          </InputOTPGroup>
                        </InputOTP>
                      </div>
                    </div>
                  </div>
                  <Button onClick={() => handleLogin('commercial')} className="w-full btn-primary">
                    {t('home.login')}
                  </Button>
                </DialogContent>
              </Dialog>
            </CardContent>
          </Card>
        </motion.div>

        {/* Floating Elements for Visual Interest */}
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-1/4 left-10 w-4 h-4 bg-success/20 rounded-full blur-sm"
        />
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-1/4 right-12 w-6 h-6 bg-accent/20 rounded-full blur-sm"
        />
      </div>
    </Layout>
  );
};

export default HomeScreen;