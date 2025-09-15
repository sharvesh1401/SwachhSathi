import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from 'recharts';
import {
  Recycle,
  ShieldCheck,
  AlertTriangle,
  QrCode,
  PieChart as PieChartIcon,
  Trash2,
  Flame
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import Navigation from '@/components/Navigation';
import LanguageToggle from '@/components/LanguageToggle';
import StreakCalendar, { StreakDay } from '@/components/StreakCalendar';
import { Separator } from '@/components/ui/separator';

interface WasteBreakdown {
  recyclable: number;
  organic: number;
  construction: number;
  hazardous: number;
}

interface CommercialStats {
  carbonCredits: number;
  complianceRate: number;
  wasteBreakdown: WasteBreakdown;
  currentStreak: number;
}

const CommercialDashboard = () => {
  const { t } = useTranslation();
  const [stats] = useState<CommercialStats>({
    carbonCredits: 125.7,
    complianceRate: 92,
    wasteBreakdown: { recyclable: 1.2, organic: 0.8, construction: 2.5, hazardous: 0.3 },
    currentStreak: 25
  });
  const [streakData, setStreakData] = useState<StreakDay[]>([]);
  const commercialId = 'COMMERCIAL-67890-ABC'; // Dummy ID

  // Dummy data for the pie chart
  const analyticsData = [
    { name: 'Recyclable', value: 68, color: '#71ACD6' },
    { name: 'Organic', value: 25, color: '#629F56' },
    { name: 'Other', value: 7, color: '#C5CCB7' },
  ];

  useEffect(() => {
    const { data } = generateStreakData(stats.currentStreak);
    setStreakData(data);
  }, [stats.currentStreak]);

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
      <Navigation userType="commercial" />
      <LanguageToggle />

      <div className="min-h-screen p-4 sm:p-6 pt-20">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-1">{t('dashboard_commercial.title')}</h1>
          <p className="text-muted-foreground">{t('dashboard_commercial.tagline')}</p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="lg:col-span-1 space-y-6">
            {/* Stats Cards */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }}>
              <Card className="card-gradient">
                <CardHeader className="pb-2 flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{t('dashboard_commercial.carbonCredits')}</CardTitle>
                  <Recycle className="h-5 w-5 text-success" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.carbonCredits}</div>
                  <p className="text-xs text-muted-foreground">{t('dashboard_commercial.creditsMonth')}</p>
                </CardContent>
              </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
              <Card className="card-gradient">
                <CardHeader className="pb-2 flex-row items-center justify-between">
                  <CardTitle className="text-sm font-medium text-muted-foreground">{t('dashboard_commercial.complianceRate')}</CardTitle>
                  <ShieldCheck className="h-5 w-5 text-accent" />
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold">{stats.complianceRate}%</div>
                   <p className="text-xs text-muted-foreground">{t('dashboard_commercial.complianceNote')}</p>
                </CardContent>
              </Card>
            </motion.div>

            {/* QR Code */}
            <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
              <Card className="card-gradient group relative overflow-hidden">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><QrCode/> {t('dashboard_commercial.qrTitle')}</CardTitle>
                </CardHeader>
                <CardContent className="flex justify-center items-center">
                  <div className="p-4 bg-white rounded-lg transition-all duration-300 group-hover:bg-gray-100">
                     <div className="absolute inset-0 bg-gradient-to-tr from-primary/10 to-accent/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300"/>
                    <QRCodeSVG value={commercialId} size={180} />
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Middle & Right Column Combined */}
          <div className="lg:col-span-2 space-y-6">
            {/* Analytics & Total Waste */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
              <Card className="card-gradient">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><PieChartIcon /> {t('dashboard_commercial.analysisTitle')}</CardTitle>
                </CardHeader>
                <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
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
                  <div className="space-y-4">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2 text-base"><Trash2 size={18}/> {t('dashboard_commercial.segregationTitle')}</CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        {Object.entries(stats.wasteBreakdown).map(([key, value]) => (
                          <div key={key} className="flex justify-between items-center text-sm">
                            <span className="capitalize text-muted-foreground">{t(`dashboard_commercial.waste_types.${key}`)}</span>
                            <span className="font-medium">{value.toFixed(1)} {t('dashboard_commercial.tons')}</span>
                          </div>
                        ))}
                        <Separator />
                        <div className="flex justify-between items-center font-bold text-base">
                          <span>{t('dashboard_commercial.total')}</span>
                          <span>
                            {Object.values(stats.wasteBreakdown).reduce((acc, val) => acc + val, 0).toFixed(1)} {t('dashboard_commercial.tons')}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Illegal Dumping Report */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
              <Card className="card-gradient bg-warning/10">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2"><AlertTriangle className="text-warning"/> {t('dashboard_commercial.reportTitle')}</CardTitle>
                  <CardDescription>{t('dashboard_commercial.reportDescription')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Link to="/report-dumping">
                    <Button className="w-full btn-primary bg-warning hover:bg-warning/90 text-white">
                      {t('dashboard_commercial.reportButton')}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="lg:col-span-1 space-y-6">
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.6 }}>
                <Card className="card-gradient">
                  <CardHeader className="pb-2 flex-row items-center justify-between">
                    <CardTitle className="text-sm font-medium text-muted-foreground">{t('dashboard_commercial.currentStreak')}</CardTitle>
                    <Flame className="h-5 w-5 text-success" />
                  </CardHeader>
                  <CardContent>
                    <div className="text-3xl font-bold">{stats.currentStreak} <span className="text-lg">{t('dashboard_commercial.days')}</span></div>
                  </CardContent>
                </Card>
            </motion.div>
            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.7 }}>
              <Card className="card-gradient">
                <CardHeader><CardTitle>{t('dashboard_commercial.streakTitle')}</CardTitle></CardHeader>
                <CardContent>
                  <StreakCalendar streakData={streakData} currentStreak={stats.currentStreak} />
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CommercialDashboard;
