import React from 'react';
import ProfilSelect from '../components/profil/ProfilSelect';
import ConnectEquipment from '../components/ConnectEquipment';
import { useStore } from '../store/store';

const EquipmentPage = () => {
  const store = useStore();

  return (
    <div className="container text-center">
      <h5 className="text-xl font-bold text-white mb-4">Equipment</h5>
      <div className="flex flex-col items-center justify-center">
        {!store.mountInfo.Connected &&
          !store.cameraInfo.Connected &&
          !store.filterInfo.Connected &&
          !store.focuserInfo.Connected &&
          !store.rotatorInfo.Connected && (
            <ProfilSelect className="mb-4" />
          )}
        <ConnectEquipment className="mb-4 space-y-2 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-6 shadow-lg" />
      </div>
    </div>
  );
};

export default EquipmentPage;
