import React from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Calendar, Flame, CheckCircle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export interface StreakDay {
  date: string;
  hasActivity: boolean;
  points: number;
}

interface StreakCalendarProps {
  streakData: StreakDay[];
  currentStreak: number;
}

const StreakCalendar: React.FC<StreakCalendarProps> = ({ streakData, currentStreak }) => {
  const { t } = useTranslation();

  const getDayName = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { weekday: 'short' });
  };

  const getDayNumber = (dateString: string) => {
    const date = new Date(dateString);
    return date.getDate();
  };

  const isToday = (dateString: string) => {
    const today = new Date().toISOString().split('T')[0];
    return dateString === today;
  };

  return (
    <Card className="card-gradient">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-lg">
          <div className="p-2 bg-success/10 rounded-lg mr-3">
            <Calendar className="h-5 w-5 text-success" />
          </div>
          {t('streak_calendar.title')}
          <div className="ml-auto flex items-center text-success">
            <Flame className="h-4 w-4 mr-1" />
            <span className="font-bold">{currentStreak} {t('dashboard_household.days')}</span>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-7 gap-2 mb-4">
          {/* Week day headers */}
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-xs text-muted-foreground text-center font-medium p-1">
              {day}
            </div>
          ))}
        </div>
        
        <div className="grid grid-cols-7 gap-2">
          {streakData.map((day, index) => (
            <motion.div
              key={day.date}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.02 }}
              className={`
                relative aspect-square rounded-lg border-2 transition-all duration-200 cursor-pointer
                ${day.hasActivity 
                  ? 'bg-success/20 border-success/40 hover:bg-success/30' 
                  : 'bg-muted/20 border-muted/40 hover:bg-muted/30'
                }
                ${isToday(day.date) ? 'ring-2 ring-accent ring-offset-2' : ''}
              `}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className={`text-xs font-medium ${
                  day.hasActivity ? 'text-success' : 'text-muted-foreground'
                }`}>
                  {getDayNumber(day.date)}
                </span>
                {day.hasActivity && (
                  <CheckCircle className="h-3 w-3 text-success mt-0.5" />
                )}
              </div>
              
              {/* Tooltip on hover */}
              <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 px-2 py-1 bg-card border border-border rounded text-xs whitespace-nowrap opacity-0 hover:opacity-100 transition-opacity z-10 pointer-events-none">
                {getDayName(day.date)} {getDayNumber(day.date)}
                {day.hasActivity && (
                  <div className="text-success">+{day.points} points</div>
                )}
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="mt-4 flex items-center justify-between text-sm text-muted-foreground">
          <div className="flex items-center">
            <div className="w-3 h-3 bg-muted/40 rounded mr-2"></div>
            {t('streak_calendar.noActivity')}
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 bg-success/40 rounded mr-2"></div>
            {t('streak_calendar.activityCompleted')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StreakCalendar;