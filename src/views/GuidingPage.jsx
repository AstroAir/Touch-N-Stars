import React from 'react';
import { useStore } from '../store/store';
import ControlGuider from '../components/guider/ControlGuider';
import GuiderStats from '../components/guider/GuiderStats';
import GuiderGraph from '../components/guider/GuiderGraph';

const GuidingPage = () => {
  const store = useStore();

  return (
    <div className="container flex items-center justify-center">
      <div className="container max-w-3xl">
        <h5 className="text-xl text-center font-bold text-white mb-4">
          {store.t('components.guider.title')}
        </h5>
        {!store.guiderInfo.Connected ? (
          <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
            <p className="text-red-400 font-medium text-center">
              {store.t('components.guider.notConnected')}
            </p>
          </div>
        ) : (
          <>
            <div className="flex flex-col md:flex-row gap-1 md:space-x-4 mt-4 border border-gray-700 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg p-5">
              <ControlGuider />
            </div>
            <div className="flex mt-5 mb-20 border border-gray-700 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg p-2">
              <div className="min-w-24 pt-4">
                <GuiderStats />
              </div>
              <div className="w-full">
                <GuiderGraph />
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default GuidingPage;
