import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  BookOpen, 
  Play, 
  CheckCircle, 
  Award,
  Lightbulb,
  ExternalLink,
  GraduationCap
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import Layout from '@/components/Layout';
import Navigation from '@/components/Navigation';
import LanguageToggle from '@/components/LanguageToggle';

const TrainingScreen = () => {
  const { t } = useTranslation();
  const [completedTips, setCompletedTips] = useState<number[]>([]);
  const [showQuiz, setShowQuiz] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const tips = [
    {
      id: 1,
      title: t('training.tips_content.segregate_title'),
      content: t('training.tips_content.segregate_content'),
      icon: "🗂️"
    },
    {
      id: 2,
      title: t('training.tips_content.compost_title'),
      content: t('training.tips_content.compost_content'),
      icon: "🌱"
    },
    {
      id: 3,
      title: t('training.tips_content.clean_title'),
      content: t('training.tips_content.clean_content'),
      icon: "🧽"
    },
    {
      id: 4,
      title: t('training.tips_content.hazardous_title'),
      content: t('training.tips_content.hazardous_content'),
      icon: "⚠️"
    },
    {
      id: 5,
      title: t('training.tips_content.reduce_title'),
      content: t('training.tips_content.reduce_content'),
      icon: "♻️"
    },
    {
      id: 6,
      title: t('training.tips_content.report_title'),
      content: t('training.tips_content.report_content'),
      icon: "📱"
    }
  ];

  const videos = [
    {
      id: "t1",
      title: t('training.videos_content.segregation_title'),
      youtubeId: "dQw4w9WgXcQ",
      duration: "5:32"
    },
    {
      id: "t2",
      title: t('training.videos_content.composting_title'),
      youtubeId: "oHg5SJYRHA0",
      duration: "8:15"
    },
    {
      id: "t3",
      title: t('training.videos_content.ewaste_title'),
      youtubeId: "V-_O7nl0Ii0",
      duration: "4:28"
    }
  ];

  const markTipComplete = (tipId: number) => {
    if (!completedTips.includes(tipId)) {
      setCompletedTips([...completedTips, tipId]);
    }
  };

  const openVideo = (youtubeId: string) => {
    window.open(`https://www.youtube.com/watch?v=${youtubeId}`, '_blank');
  };

  const completeQuiz = () => {
    setQuizCompleted(true);
    setShowQuiz(false);
    // Award bonus points
    const stats = JSON.parse(localStorage.getItem('swachh-user-stats') || '{}');
    stats.totalPoints = (stats.totalPoints || 0) + 10;
    stats.todayPoints = (stats.todayPoints || 0) + 10;
    localStorage.setItem('swachh-user-stats', JSON.stringify(stats));
  };

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
          <div className="flex items-center justify-center mb-4">
            <div className="p-3 bg-accent/10 rounded-full mr-3">
              <GraduationCap className="h-8 w-8 text-accent" />
            </div>
            <h1 className="text-3xl font-bold">{t('training.title')}</h1>
          </div>
          <p className="text-muted-foreground">Learn proper waste management techniques</p>
        </motion.div>

        {/* Completion Status */}
        {quizCompleted && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="mb-8"
          >
            <Card className="card-gradient border-success/50 bg-success/5">
              <CardContent className="p-6 text-center">
                <div className="flex items-center justify-center mb-3">
                  <Award className="h-8 w-8 text-success mr-2" />
                  <h2 className="text-xl font-semibold text-success">
                    {t('training.completed')}
                  </h2>
                </div>
                <p className="text-muted-foreground">{t('training.completedDescription')}</p>
              </CardContent>
            </Card>
          </motion.div>
        )}

        {/* Tips Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex items-center mb-6">
            <Lightbulb className="h-6 w-6 text-accent mr-3" />
            <h2 className="text-2xl font-semibold">{t('training.tipsSection')}</h2>
            <Badge variant="secondary" className="ml-auto">
              {completedTips.length}/{tips.length}
            </Badge>
          </div>

          <div className="grid gap-4">
            {tips.map((tip, index) => (
              <motion.div
                key={tip.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.3 + index * 0.1 }}
              >
                <Card className={`card-gradient transition-all duration-300 ${
                  completedTips.includes(tip.id) ? 'border-success/50 bg-success/5' : ''
                }`}>
                  <CardContent className="p-6">
                    <div className="flex items-start space-x-4">
                      <div className="text-3xl">{tip.icon}</div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="text-lg font-semibold">{tip.title}</h3>
                          {completedTips.includes(tip.id) && (
                            <CheckCircle className="h-5 w-5 text-success" />
                          )}
                        </div>
                        <p className="text-muted-foreground mb-4">{tip.content}</p>
                        {!completedTips.includes(tip.id) && (
                          <Button
                            onClick={() => markTipComplete(tip.id)}
                            variant="outline"
                            size="sm"
                          >
                            {t('training.markAsRead')}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Videos Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mb-12"
        >
          <div className="flex items-center mb-6">
            <Play className="h-6 w-6 text-accent mr-3" />
            <h2 className="text-2xl font-semibold">{t('training.videosSection')}</h2>
          </div>

          <div className="grid gap-4">
            {videos.map((video, index) => (
              <motion.div
                key={video.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6 + index * 0.1 }}
              >
                <Card className="card-gradient">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-primary/10 rounded-lg">
                          <Play className="h-6 w-6 text-primary" />
                        </div>
                        <div>
                          <h3 className="font-semibold">{video.title}</h3>
                          <p className="text-sm text-muted-foreground">{video.duration}</p>
                        </div>
                      </div>
                      <Button
                        onClick={() => openVideo(video.youtubeId)}
                        className="btn-primary"
                      >
                        <ExternalLink className="h-4 w-4 mr-2" />
                        {t('training.watch')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Quiz Section */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <Card className="card-gradient text-center">
            <CardHeader>
              <CardTitle className="flex items-center justify-center">
                <BookOpen className="h-6 w-6 mr-3" />
                {t('training.quiz')}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-6">{t('training.testKnowledge')}</p>
              <Button
                onClick={completeQuiz}
                disabled={quizCompleted}
                className="btn-success"
              >
                {quizCompleted ? t('training.quizCompleted') : t('training.startQuiz')}
              </Button>
            </CardContent>
          </Card>
        </motion.section>
      </div>
    </Layout>
  );
};

export default TrainingScreen;