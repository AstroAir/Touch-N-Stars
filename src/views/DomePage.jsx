import React from 'react';
import ControlDome from '../components/dome/ControlDome';
import InfoDome from '../components/dome/InfoDome';
import { useStore } from '../store/store';

const DomePage = () => {
  const store = useStore();

  return (
    <div className="container flex items-center justify-center">
      <div className="container max-w-md landscape:max-w-xl">
        <h5 className="text-xl text-center font-bold text-white mb-4">
          Dome Control
        </h5>
        <InfoDome
          isConnected={store.domeInfo.Connected}
          className="gap-1 p-2 bg-gray-800/50 rounded-lg border border-gray-700/50"
        />
        {store.domeInfo.Connected && (
          <div className="mt-4 border border-gray-700 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg">
            <div className="container pl-5 pb-5 pr-5">
              <ControlDome />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DomePage;
