import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  Trophy, 
  Flame, 
  Coins, 
  Calendar,
  Droplets,
  Trash2,
  AlertTriangle,
  CheckCircle,
  Clock
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Button } from '@/components/ui/button';
import Layout from '@/components/Layout';
import Navigation from '@/components/Navigation';
import LanguageToggle from '@/components/LanguageToggle';
import StreakCalendar from '@/components/StreakCalendar';

interface UserStats {
  todayPoints: number;
  totalPoints: number;
  currentStreak: number;
  wetWasteSegregated: number;
  dryWasteSegregated: number;
  hazardousWasteSegregated: number;
  wetWastePending: number;
  dryWastePending: number;
  hazardousPending: number;
}

const DashboardScreen = () => {
  const { t } = useTranslation();
  const [stats, setStats] = useState<UserStats>({
    todayPoints: 0,
    totalPoints: 0,
    currentStreak: 0,
    wetWasteSegregated: 0,
    dryWasteSegregated: 0,
    hazardousWasteSegregated: 0,
    wetWastePending: 0,
    dryWastePending: 0,
    hazardousPending: 0,
  });

  const [showPointsAnimation, setShowPointsAnimation] = useState(false);

  useEffect(() => {
    // Load stats from localStorage or initialize with demo data
    const savedStats = localStorage.getItem('swachh-user-stats');
    if (savedStats) {
      setStats(JSON.parse(savedStats));
    } else {
      // Demo data
      const demoStats: UserStats = {
        todayPoints: 12,
        totalPoints: 248,
        currentStreak: 7,
        wetWasteSegregated: 85,
        dryWasteSegregated: 92,
        hazardousWasteSegregated: 67,
        wetWastePending: 15,
        dryWastePending: 8,
        hazardousPending: 33,
      };
      setStats(demoStats);
      localStorage.setItem('swachh-user-stats', JSON.stringify(demoStats));
    }
  }, []);

  const addPoints = (points: number) => {
    const newStats = {
      ...stats,
      todayPoints: stats.todayPoints + points,
      totalPoints: stats.totalPoints + points,
    };
    setStats(newStats);
    localStorage.setItem('swachh-user-stats', JSON.stringify(newStats));
    setShowPointsAnimation(true);
    setTimeout(() => setShowPointsAnimation(false), 1000);
  };

  const wasteTypes = [
    {
      type: 'wetWaste',
      icon: Droplets,
      color: 'text-green-500',
      bgColor: 'bg-green-500/10',
      segregated: stats.wetWasteSegregated,
      pending: stats.wetWastePending,
    },
    {
      type: 'dryWaste',
      icon: Trash2,
      color: 'text-blue-500',
      bgColor: 'bg-blue-500/10',
      segregated: stats.dryWasteSegregated,
      pending: stats.dryWastePending,
    },
    {
      type: 'hazardous',
      icon: AlertTriangle,
      color: 'text-orange-500',
      bgColor: 'bg-orange-500/10',
      segregated: stats.hazardousWasteSegregated,
      pending: stats.hazardousPending,
    },
  ];

  return (
    <Layout>
      <Navigation />
      <LanguageToggle />
      
      <div className="min-h-screen p-6 pt-20">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-3xl font-bold mb-2">{t('dashboard.title')}</h1>
          <p className="text-muted-foreground">Track your waste segregation progress</p>
        </motion.div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Today's Points */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 }}
          >
            <Card className="card-gradient relative overflow-hidden">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t('dashboard.todayPoints')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-warning/10 rounded-lg">
                    <Coins className="h-6 w-6 text-warning" />
                  </div>
                  <motion.div
                    className={`text-3xl font-bold ${showPointsAnimation ? 'points-bounce' : ''}`}
                  >
                    {stats.todayPoints}
                  </motion.div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Total Points */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="card-gradient">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t('dashboard.totalPoints')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-accent/10 rounded-lg">
                    <Trophy className="h-6 w-6 text-accent" />
                  </div>
                  <div className="text-3xl font-bold">{stats.totalPoints}</div>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Current Streak */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <Card className="card-gradient">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">
                  {t('dashboard.currentStreak')}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-success/10 rounded-lg streak-glow">
                    <Flame className="h-6 w-6 text-success" />
                  </div>
                  <div className="text-3xl font-bold">
                    {stats.currentStreak}
                    <span className="text-sm font-normal text-muted-foreground ml-1">
                      {t('dashboard.days')}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Streak Calendar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mb-8"
        >
          <StreakCalendar />
        </motion.div>

        {/* Waste Segregation Status */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="space-y-6"
        >
          <h2 className="text-xl font-semibold">Waste Segregation Status</h2>
          
          <div className="grid gap-6">
            {wasteTypes.map((waste, index) => {
              const Icon = waste.icon;
              const total = waste.segregated + waste.pending;
              const progress = total > 0 ? (waste.segregated / total) * 100 : 0;
              
              return (
                <motion.div
                  key={waste.type}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  <Card className="card-gradient">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className={`p-3 ${waste.bgColor} rounded-lg`}>
                            <Icon className={`h-6 w-6 ${waste.color}`} />
                          </div>
                          <div>
                            <h3 className="font-semibold">
                              {t(`dashboard.${waste.type}`)}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {waste.segregated}% completed
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center space-x-4 text-sm">
                            <div className="flex items-center text-success">
                              <CheckCircle className="h-4 w-4 mr-1" />
                              {waste.segregated}% {t('dashboard.segregated')}
                            </div>
                            <div className="flex items-center text-muted-foreground">
                              <Clock className="h-4 w-4 mr-1" />
                              {waste.pending}% {t('dashboard.pending')}
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <Progress value={progress} className="h-2 mb-2" />
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Demo Action Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.9 }}
          className="mt-8 text-center"
        >
          <Button
            onClick={() => addPoints(5)}
            className="btn-success"
          >
            <Coins className="w-5 h-5 mr-2" />
            Simulate Segregation (+5 points)
          </Button>
        </motion.div>
      </div>
    </Layout>
  );
};

export default DashboardScreen;