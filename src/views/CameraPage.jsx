import React, { useState, useEffect } from 'react';
import CenterHere from '../components/camera/CenterHere';
import InfoCamera from '../components/camera/InfoCamera';
import { useCameraStore } from '../store/cameraStore';
import { useStore } from '../store/store';

const CameraPage = () => {
  const cameraStore = useCameraStore();
  const store = useStore();
  const [exposureTime, setExposureTime] = useState(2);
  const [gain, setGain] = useState(0);

  useEffect(() => {
    // Initialize camera settings from store
    setExposureTime(store.cameraSettings.exposureTime);
    setGain(store.cameraSettings.gain);
  }, [store.cameraSettings]);

  const handleCapture = async () => {
    try {
      await cameraStore.capturePhoto(exposureTime, gain);
    } catch (error) {
      console.error('Error capturing photo:', error);
    }
  };

  const handleAbort = async () => {
    try {
      await cameraStore.abortExposure();
    } catch (error) {
      console.error('Error aborting exposure:', error);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-xl font-bold text-center mb-4">Camera Control</h1>
      <div className="flex flex-col items-center">
        <InfoCamera />
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Exposure Time (s)</label>
          <input
            type="number"
            value={exposureTime}
            onChange={(e) => setExposureTime(Number(e.target.value))}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
          />
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700">Gain</label>
          <input
            type="number"
            value={gain}
            onChange={(e) => setGain(Number(e.target.value))}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-cyan-500 focus:border-cyan-500 sm:text-sm"
          />
        </div>
        <div className="mt-4 flex space-x-4">
          <button
            onClick={handleCapture}
            className="px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700"
          >
            Capture
          </button>
          <button
            onClick={handleAbort}
            className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            Abort
          </button>
        </div>
        <div className="mt-4">
          <CenterHere />
        </div>
      </div>
    </div>
  );
};

export default CameraPage;
