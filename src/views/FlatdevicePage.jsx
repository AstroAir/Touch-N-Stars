import React from 'react';
import ControlFlatdevice from '@/components/flatdevice/ControlFlatdevice';
import InfoFlatdevice from '@/components/flatdevice/InfoFlatdevice';
import { apiStore } from '@/store/store';

const FlatdevicePage = () => {
  const store = apiStore();

  return (
    <div className="text-left mb-2">
      <h1 className="text-xl text-center font-bold">Flat Device</h1>
      {!store.flatdeviceInfo.Connected ? (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-red-400 font-medium text-center">
            Please connect the flat device.
          </p>
        </div>
      ) : (
        <div className="container flex items-center justify-center">
          <div className="container max-w-md landscape:max-w-xl">
            <div>
              <InfoFlatdevice className="grid grid-cols-2 landscape:grid-cols-3" />
            </div>
            <div className="mt-4 border border-gray-700 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg p-5">
              <ControlFlatdevice className="w-full" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FlatdevicePage;
