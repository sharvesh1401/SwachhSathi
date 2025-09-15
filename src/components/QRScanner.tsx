import React, { useRef, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { Camera, CameraOff, Loader } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface QRScannerProps {
  onScan: (result: string | null) => void;
}

const QRScanner: React.FC<QRScannerProps> = ({ onScan }) => {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState('');
  const [stream, setStream] = useState<MediaStream | null>(null);

  const startCamera = async () => {
    try {
      setError('');
      setIsScanning(true);
      
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { 
          facingMode: 'environment', // Use back camera if available
          width: { ideal: 640 },
          height: { ideal: 480 }
        }
      });
      
      setStream(mediaStream);
      
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err) {
      setError('Camera access denied or not available');
      setIsScanning(false);
      console.error('Camera error:', err);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
    setIsScanning(false);
  };

  const simulateQRScan = () => {
    // Simulate a successful QR scan for demo purposes
    const mockQRCode = 'SWACHH-DEMO-' + Date.now();
    onScan(mockQRCode);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  return (
    <div className="space-y-4">
      <div className="qr-scanner relative bg-black rounded-2xl overflow-hidden aspect-square">
        {isScanning ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              className="w-full h-full object-cover"
            />
            {/* Scanning overlay */}
            <div className="absolute inset-0 border-4 border-accent/50 rounded-2xl">
              <motion.div
                initial={{ y: 0 }}
                animate={{ y: ['0%', '100%', '0%'] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
                className="absolute left-0 right-0 h-1 bg-accent shadow-lg"
                style={{ filter: 'drop-shadow(0 0 10px hsl(270 40% 75%))' }}
              />
            </div>
            {/* Corner indicators */}
            <div className="absolute top-4 left-4 w-6 h-6 border-l-4 border-t-4 border-accent rounded-tl-lg" />
            <div className="absolute top-4 right-4 w-6 h-6 border-r-4 border-t-4 border-accent rounded-tr-lg" />
            <div className="absolute bottom-4 left-4 w-6 h-6 border-l-4 border-b-4 border-accent rounded-bl-lg" />
            <div className="absolute bottom-4 right-4 w-6 h-6 border-r-4 border-b-4 border-accent rounded-br-lg" />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-muted/20">
            <div className="text-center text-muted-foreground">
              <CameraOff className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p>{t('qr_scanner.cameraNotActive')}</p>
            </div>
          </div>
        )}
      </div>

      {/* Hidden canvas for potential frame processing */}
      <canvas ref={canvasRef} className="hidden" />

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-destructive text-sm bg-destructive/10 p-3 rounded-lg"
        >
          {error}
        </motion.div>
      )}

      {/* Controls */}
      <div className="space-y-3">
        {!isScanning ? (
          <Button onClick={startCamera} className="w-full h-12 btn-primary">
            <Camera className="w-5 h-5 mr-2" />
            {t('qr_scanner.startCamera')}
          </Button>
        ) : (
          <Button onClick={stopCamera} variant="outline" className="w-full h-12">
            <CameraOff className="w-5 h-5 mr-2" />
            {t('qr_scanner.stopCamera')}
          </Button>
        )}

        {/* Demo Button - simulate QR scan */}
        <Button
          onClick={simulateQRScan}
          variant="ghost"
          className="w-full text-accent hover:text-accent/80 hover:bg-accent/10"
        >
          {t('qr_scanner.simulateQR')}
        </Button>
      </div>

      <p className="text-xs text-center text-muted-foreground">{t('qr_scanner.instruction')}</p>
    </div>
  );
};

export default QRScanner;