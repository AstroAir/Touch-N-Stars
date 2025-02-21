import React from 'react';
import LastSequenceImg from '@/components/sequence/LastSequenceImg';
import SequenzGraph from '@/components/sequence/SequenzGraph';
import GuiderGraph from '@/components/guider/GuiderGraph';
import GuiderStats from '@/components/guider/GuiderStats';
import AutofocusGrafik from '@/components/focuser/AutofocusGrafik';

const SequenceMonitoring = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-6">
      <div className="max-w-6xl mx-auto lg:px-4">
        <div className="space-y-6 md:space-y-8">
          <div className="backdrop-blur-sm bg-gray-800/50 rounded-xl p-4 shadow-xl">
            <LastSequenceImg />
            <SequenzGraph />
            <GuiderGraph />
            <GuiderStats />
            <AutofocusGrafik />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SequenceMonitoring;
