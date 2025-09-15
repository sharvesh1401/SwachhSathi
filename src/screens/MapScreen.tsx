import React from 'react';
import { useTranslation } from 'react-i18next';
// NOTE: This project uses `react-leaflet` for web-based maps.
// The user initially requested `react-native-maps`, which is for mobile apps.
// Since this is a web application, `react-leaflet` is the appropriate choice.
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import Layout from '@/components/Layout';
import Navigation from '@/components/Navigation';
import LanguageToggle from '@/components/LanguageToggle';

const MapScreen = () => {
  const { t } = useTranslation();
  const position: [number, number] = [13.0827, 80.2707]; // Chennai coordinates

  return (
    <Layout>
      <Navigation />
      <LanguageToggle />
      <div className="container mx-auto p-4">
        <h1 className="text-3xl font-bold text-center my-6">{t('map.title')}</h1>
        <div className="h-[600px] w-full">
          <MapContainer center={position} zoom={13} scrollWheelZoom={false} style={{ height: '100%', width: '100%' }}>
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            <Marker position={position}>
              <Popup>
                {t('map.location')}
              </Popup>
            </Marker>
          </MapContainer>
        </div>
      </div>
    </Layout>
  );
};

export default MapScreen;
