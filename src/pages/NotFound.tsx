import { useLocation } from "react-router-dom";
import { useTranslation } from 'react-i18next';
import { useEffect } from "react";

const NotFound = () => {
  const { t } = useTranslation();
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100">
      <div className="text-center">
        <h1 className="mb-4 text-4xl font-bold">{t('errors.404')}</h1>
        <p className="mb-4 text-xl text-gray-600">{t('errors.pageNotFound')}</p>
        <a href="/" className="text-blue-500 underline hover:text-blue-700">
          {t('errors.returnHome')}
        </a>
      </div>
    </div>
  );
};

export default NotFound;
