import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { 
  Home, 
  LogIn, 
  GraduationCap, 
  Map, 
  Gift, 
  Recycle,
  Menu,
  LogOut,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface NavigationProps {
  userType: 'household' | 'commercial';
}

const Navigation: React.FC<NavigationProps> = ({ userType }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = React.useState(false);

  // Check if user is logged in (you might want to replace this with actual auth state)
  const isLoggedIn = location.pathname !== '/';

  const baseNavItems = [
    { path: '/dashboard', icon: Home, label: t('navigation.home') },
    { path: '/training', icon: GraduationCap, label: t('navigation.training') },
    { path: '/map', icon: Map, label: t('navigation.map') },
  ];

  const userSpecificItems = userType === 'commercial'
    ? [
        { path: '/rewards', icon: Recycle, label: t('navigation.carbonCredits') },
      ]
    : [
        { path: '/rewards', icon: Gift, label: t('navigation.rewards') },
      ];

  const navItems = [...baseNavItems, ...userSpecificItems];

  const handleNavigation = (path: string) => {
    navigate(path);
    setIsOpen(false);
  };

  const handleAuthAction = () => {
    if (isLoggedIn) {
      // Handle logout logic here
      navigate('/');
    } else {
      // Handle login logic here
      navigate('/dashboard'); // Or your actual login route
    }
    setIsOpen(false);
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <Button 
          variant="ghost" 
          size="icon"
          className="fixed top-4 left-4 z-50 bg-card/80 backdrop-blur-sm border border-border/50 hover:bg-card/90"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-80 p-0 bg-card/95 backdrop-blur-md border-r border-border/50">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="p-6 border-b border-border/50">
            <motion.h2 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent"
            >
              {t('app.name')}
            </motion.h2>
            <motion.p 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="text-sm text-muted-foreground mt-1"
            >
              {t('app.tagline')}
            </motion.p>
          </div>

          {/* Navigation Items */}
          <div className="flex-1 p-4 space-y-2">
            {navItems.map((item, index) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              
              return (
                <motion.div
                  key={item.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <Button
                    variant={isActive ? "default" : "ghost"}
                    className={`w-full justify-start h-12 ${
                      isActive 
                        ? 'bg-gradient-to-r from-primary to-accent text-primary-foreground' 
                        : 'hover:bg-accent/10'
                    }`}
                    onClick={() => handleNavigation(item.path)}
                  >
                    <Icon className="h-5 w-5 mr-3" />
                    {item.label}
                  </Button>
                </motion.div>
              );
            })}
          </div>

          {/* Auth Button at Bottom */}
          <div className="p-4 border-t border-border/50">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <Button
                variant="outline"
                className="w-full justify-start h-12 border-primary/20 hover:bg-primary/10"
                onClick={handleAuthAction}
              >
                {isLoggedIn ? (
                  <LogOut className="h-5 w-5 mr-3" />
                ) : (
                  <LogIn className="h-5 w-5 mr-3" />
                )}
                {t('navigation.loginLogout')}
              </Button>
            </motion.div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default Navigation;