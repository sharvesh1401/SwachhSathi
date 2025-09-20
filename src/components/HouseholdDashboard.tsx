import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import {
  Trophy,
  Flame,
  Coins,
  AlertTriangle,
  QrCode,
  PieChart as PieChartIcon,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import Navigation from '@/components/Navigation';
import LanguageToggle from '@/components/LanguageToggle';
import StreakCalendar, { StreakDay } from '@/components/StreakCalendar';
import { Separator } from '@/components/ui/separator';

interface WasteBreakdown {
  organic: number;
  plastic: number;
  paper: number;
  metals: number;
  other: number;
}

interface UserStats {
  totalPoints: number;
  currentStreak: number;
  wasteBreakdown: WasteBreakdown;
}

const HouseholdDashboard = () => {
  const { t } = useTranslation();
  const [userId, setUserId] = useState<string>("");
  const [qrValue, setQrValue] = useState<string>("");
  const [stats, setStats] = useState<UserStats>({
    totalPoints: 350,
    currentStreak: 12,
    wasteBreakdown: { organic: 25.2, plastic: 18.5, paper: 22.1, metals: 8.7, other: 4.0 }
  });
  const [streakData, setStreakData] = useState<StreakDay[]>([]);

  // Dummy data for the pie chart
  const analyticsData = [
    { name: 'Paper', value: 45, color: '#71ACD6' },
    { name: 'Plastic', value: 31, color: '#FCB07E' },
    { name: 'Metals', value: 24, color: '#629F56' },
  ];

  useEffect(() => {
    // Get or create user ID from localStorage/backend
    const storedId = localStorage.getItem("householdUserId");
    if (storedId) {
      setUserId(storedId);
      setQrValue(`household:${storedId}`);
    } else {
      // Generate a unique ID for the user
      const newUserId = generateUniqueId();
      setUserId(newUserId);
      setQrValue(`household:${newUserId}`);
      
      // Store the user ID in localStorage
      localStorage.setItem("householdUserId", newUserId);
      
      // Send the user ID to the backend
      fetch("http://localhost:5000/api/users", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: newUserId })
      })
        .then((res) => res.json())
        .then((data) => {
          console.log("User created in backend:", data);
        })
        .catch((err) => console.error("Error creating user:", err));
    }

    // Generate streak data
    const { data } = generateStreakData(stats.currentStreak);
    setStreakData(data);
  }, [stats.currentStreak]);

  // Function to generate a unique ID
  const generateUniqueId = () => {
    return 'household-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9);
  };

  const generateStreakData = (currentStreak: number): { data: StreakDay[], streak: number } => {
    const data: StreakDay[] = [];
    const today = new Date();
    for (let i = 29; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const hasActivity = i < currentStreak;
      data.push({
        date: date.toISOString().split('T')[0],
        hasActivity,
        points: hasActivity ? Math.floor(Math.random() * 15) + 5 : 0
      });
    }
    return { data, streak: currentStreak };
  };

  return (
    <Layout>
      <Navigation userType="household" />
      <LanguageToggle />

      <div className="min-h-screen p-4 sm:p-6 pt-20">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-1">{t('dashboard_household.title')}</h1>
          <p className="text-muted-foreground">{t('dashboard_household.tagline')}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stats Cards */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <Card className="card-gradient">
                <CardHeader className="pb-2 flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{t('dashboard_household.totalPoints')}</CardTitle>
                  <Trophy className="h-5 w-5 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.totalPoints}</div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card className="card-gradient">
                <CardHeader className="pb-2 flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{t('dashboard_household.currentStreak')}</CardTitle>
                  <Flame className="h-5 w-5 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.currentStreak} <span className="text-lg">{t('dashboard_household.days')}</span></div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Household QR Code */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <Card className="card-gradient group relative overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><QrCode/> {t('dashboard_household.qrTitle')}</CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col items-center">
                  {qrValue ? (
                    <>
                      <div className="p-4 bg-white rounded-lg transition-all duration-300 group-hover:bg-gray-100 mb-4">
                        <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                        <QRCodeSVG 
                          value={qrValue} 
                          size={180} 
                        />
                      </div>
                      <p className="text-sm text-muted-foreground">Household ID: {userId}</p>
                    </>
                  ) : (
                    <p className="text-muted-foreground">Loading QR code...</p>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Middle Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Analytics */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="card-gradient h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><PieChartIcon /> {t('dashboard_household.classificationTitle')}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div style={{ width: '100%', height: 250 }}>
                    <ResponsiveContainer>
                      <PieChart>
                        <Pie data={analyticsData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label>
                          {analyticsData.map((entry, index) => <Cell key={`cell-${index}`} fill={entry.color} />)}
                        </Pie>
                        <Tooltip />
                        <Legend />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Card className="card-gradient">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><Trash2 /> {t('dashboard_household.segregationTitle')}</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(stats.wasteBreakdown).map(([key, value]) => (
                    <div key={key} className="flex justify-between items-center text-sm">
                      <span className="capitalize text-muted-foreground">{t(`dashboard_household.waste_types.${key}`)}</span>
                      <span className="font-medium">{value.toFixed(1)} {t('dashboard_household.kg')}</span>
                    </div>
                  ))}
                  <Separator />
                  <div className="flex justify-between items-center font-bold text-base">
                    <span>{t('dashboard_household.total')}</span>
                    <span>
                      {Object.values(stats.wasteBreakdown).reduce((acc, val) => acc + val, 0).toFixed(1)} {t('dashboard_household.kg')}
                    </span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Streak Calendar */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
              <Card className="card-gradient">
                <CardHeader><CardTitle>{t('dashboard_household.streakTitle')}</CardTitle></CardHeader>
                <CardContent>
                  <StreakCalendar streakData={streakData} currentStreak={stats.currentStreak} />
                </CardContent>
              </Card>
            </motion.div>

            {/* Illegal Dumping Report */}
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
              <Card className="card-gradient bg-warning/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><AlertTriangle className="text-warning"/> {t('dashboard_household.reportTitle')}</CardTitle>
                  <CardDescription>{t('dashboard_household.reportDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/report-dumping">
                    <Button className="w-full btn-primary bg-warning hover:bg-warning/90 text-white">
                      {t('dashboard_household.reportButton')}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default HouseholdDashboard;