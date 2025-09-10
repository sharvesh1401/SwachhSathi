import React from 'react';
import Layout from '@/components/Layout';
import Navigation from '@/components/Navigation';

const RewardsScreen = () => {
  return (
    <Layout>
      <Navigation />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center my-6">Rewards</h1>
        <div className="text-center">
          <p>This page is under construction. Check back later for rewards!</p>
        </div>
      </div>
    </Layout>
  );
};

export default RewardsScreen;
