import React from 'react';
import ControlSwitch from '@/components/switch/ControlSwitch';
import InfoSwitch from '@/components/switch/InfoSwitch';

const SwitchPage = () => {
  return (
    <div className="flex flex-col items-center justify-center max-w-md mx-auto">
      <div className="flex-col w-full space-y-2 mt-4 border border-gray-700 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg p-5">
        <strong>Gauges</strong>
        <InfoSwitch />
      </div>
      <div className="flex-col w-full space-y-2 mt-4 border border-gray-700 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg p-5">
        <strong>Switch</strong>
        <ControlSwitch />
      </div>
    </div>
  );
};

export default SwitchPage;
