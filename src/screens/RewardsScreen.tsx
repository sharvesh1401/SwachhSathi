import React from 'react';
import { useTranslation } from 'react-i18next';
import Layout from '@/components/Layout';
import Navigation from '@/components/Navigation';
import LanguageToggle from '@/components/LanguageToggle';

const RewardsScreen = () => {
  const { t } = useTranslation();

  return (
    <Layout>
      <Navigation />
      <LanguageToggle />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center my-6">{t('rewards.title')}</h1>
        <div className="text-center">
          <p>{t('rewards.underConstruction')}</p>
        </div>
      </div>
    </Layout>
  );
};

export default RewardsScreen;
