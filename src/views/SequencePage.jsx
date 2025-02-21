import React, { useState } from 'react';
import { useStore } from '../store/store';
import InfoSequence from '../components/sequence/InfoSequence';
import ControlSequence from '../components/sequence/ControlSequence';

const SequencePage = () => {
  const store = useStore();
  const [currentTab, setCurrentTab] = useState('showSequenz');

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 to-gray-800 p-4 md:p-6">
      <div className="max-w-6xl mx-auto lg:px-4">
        <div className="space-y-6 md:space-y-8">
          <div className="backdrop-blur-sm bg-gray-800/50 rounded-xl p-4 shadow-xl">
            <ControlSequence />
            {currentTab === 'showSequenz' && (
              <div className="space-y-6 md:space-y-8">
                <InfoSequence />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SequencePage;
