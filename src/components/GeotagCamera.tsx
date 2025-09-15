import React, { useState, useEffect, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Camera, MapPin, RefreshCw, Upload, Loader2, VideoOff, CheckCircle } from 'lucide-react';

type GeolocationData = {
  lat: number;
  lng: number;
  accuracy: number;
};

const GeotagCamera = () => {
  const { t } = useTranslation();
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [location, setLocation] = useState<GeolocationData | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    startCameraAndLocation();
    return () => {
      stopCamera();
    };
  }, []);

  const startCameraAndLocation = async () => {
    setIsProcessing(true);
    setError(null);
    try {
      // Start camera
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' },
        audio: false,
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }

      // Get location
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
            accuracy: position.coords.accuracy,
          });
          toast.success(t('geotag_camera.toast.ready'));
        },
        (err) => {
          const message = t('geotag_camera.toast.locationError', { message: err.message });
          setError(message);
          toast.error(message);
        },
        { enableHighAccuracy: true }
      );
    } catch (err: any) {
      const message = t('geotag_camera.toast.cameraError', { message: err.message });
      setError(message);
      toast.error(t('geotag_camera.toast.cameraErrorPermission'));
    } finally {
      setIsProcessing(false);
    }
  };

  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
    }
  };

  const handleCaptureAndSubmit = async () => {
    if (!videoRef.current || !canvasRef.current || !location) {
      toast.error(t('geotag_camera.toast.notReady'));
      return;
    }

    setIsProcessing(true);
    toast.info(t('geotag_camera.toast.capturing'));

    const video = videoRef.current;
    const canvas = canvasRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context?.drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

    canvas.toBlob(async (blob) => {
      if (!blob) {
        toast.error(t('geotag_camera.toast.captureFailed'));
        setIsProcessing(false);
        return;
      }

      const photoFile = new File([blob], `report-${Date.now()}.jpg`, { type: 'image/jpeg' });
      const formData = new FormData();
      formData.append('photo', photoFile);
      formData.append('lat', location.lat.toString());
      formData.append('lng', location.lng.toString());
      formData.append('accuracy', location.accuracy.toString());
      formData.append('timestamp', new Date().toISOString());

      try {
        const response = await fetch('http://localhost:3001/api/report', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error(t('geotag_camera.toast.submitFailed'));

        const result = await response.json();
        toast.success(t('geotag_camera.toast.submitSuccess'));
        console.log("Report submitted:", result);
        // Optionally, show a success screen or navigate away
      } catch (err: any) {
        toast.error(err.message || t('geotag_camera.toast.unknownError'));
      } finally {
        setIsProcessing(false);
      }
    }, 'image/jpeg', 0.9);
  };

  return (
    <div className="fixed inset-0 bg-black flex flex-col items-center justify-center text-white">
      <canvas ref={canvasRef} className="hidden" />

      {error && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-black/70 p-4 rounded-lg z-20 text-center">
            <VideoOff className="mx-auto h-12 w-12 text-destructive mb-4" />
            <h2 className="text-xl font-bold mb-2">{t('geotag_camera.error.title')}</h2>
            <p className="text-muted-foreground">{error}</p>
            <Button onClick={startCameraAndLocation} className="mt-4">{t('geotag_camera.error.tryAgain')}</Button>
        </div>
      )}

      <video
        ref={videoRef}
        autoPlay
        playsInline
        className={`w-full h-full object-cover transition-opacity duration-300 ${error ? 'opacity-20' : 'opacity-100'}`}
      />

      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

      <div className="absolute bottom-0 left-0 right-0 p-6 flex flex-col items-center z-10">
        {location && (
            <motion.div
                initial={{opacity: 0, y: 10}}
                animate={{opacity: 1, y: 0}}
                className="bg-black/50 text-white text-xs px-3 py-1.5 rounded-full mb-4 flex items-center gap-2"
            >
                <MapPin size={12} />
                <span>{t('geotag_camera.locationText', { lat: location.lat.toFixed(4), lng: location.lng.toFixed(4), accuracy: location.accuracy.toFixed(1) })}</span>
            </motion.div>
        )}

        <button
          onClick={handleCaptureAndSubmit}
          disabled={isProcessing || !stream || !location}
          className="w-20 h-20 rounded-full bg-white flex items-center justify-center ring-4 ring-white/30 ring-offset-4 ring-offset-black/50 disabled:opacity-50 disabled:cursor-not-allowed transition-transform duration-200 active:scale-90"
          aria-label={t('geotag_camera.captureAriaLabel')}
        >
            {isProcessing ? <Loader2 className="h-8 w-8 animate-spin text-black" /> : <Camera className="h-8 w-8 text-black" />}
        </button>

        <p className="text-center mt-4 text-sm text-white/80">
            {t('geotag_camera.instruction')}
        </p>
      </div>
    </div>
  );
};

export default GeotagCamera;
