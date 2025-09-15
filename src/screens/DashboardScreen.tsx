import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import HouseholdDashboard from '@/components/HouseholdDashboard';
import CommercialDashboard from '@/components/CommercialDashboard';
import { Loader2 } from 'lucide-react';

const DashboardScreen = () => {
  const { t } = useTranslation();
  const [userType, setUserType] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserType = localStorage.getItem('userType');
    if (storedUserType) {
      setUserType(storedUserType);
    } else {
      // If no user type is found, redirect to the login page
      navigate('/');
    }
    setLoading(false);
  }, [navigate]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">{t('common.loading')}</p>
        </div>
      </div>
    );
  }

  if (userType === 'household') {
    return <HouseholdDashboard />;
  }

  if (userType === 'commercial') {
    return <CommercialDashboard />;
  }

  // Fallback, though the useEffect should handle redirection
  return null;
};

export default DashboardScreen;