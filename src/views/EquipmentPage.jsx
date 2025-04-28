import React from 'react';
import ProfilSelect from '../components/profil/ProfilSelect';
import ConnectEquipment from '../components/equipment/ConnectEquipment';
import { apiStore } from '../store/store';

const EquipmentPage = () => {
  const store = apiStore();

  return (
    <div className="flex flex-col items-center">
      <div className="flex flex-col max-w-lg items-center justify-center">
        <h5 className="text-xl font-bold text-white mb-4">Equipment</h5>
        <div className="flex flex-col items-center justify-center">
          {!store.mountInfo.Connected &&
          !store.cameraInfo.Connected &&
          !store.filterInfo.Connected &&
          !store.focuserInfo.Connected &&
          !store.rotatorInfo.Connected &&
          !store.guiderInfo.Connected &&
          !store.weatherInfo.Connected &&
          !store.safetyInfo.Connected &&
          !store.flatdeviceInfo.Connected &&
          !store.domeInfo.Connected &&
          !store.switchInfo.Connected ? (
            <div className="flex items-center justify-center mb-4 w-full space-y-2 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-6 shadow-lg">
              <ProfilSelect />
            </div>
          ) : null}
          <div className="mb-24 space-y-2 bg-gradient-to-br from-gray-800 to-gray-900 border border-gray-700 rounded-lg p-6 shadow-lg">
            <ConnectEquipment />
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentPage;
