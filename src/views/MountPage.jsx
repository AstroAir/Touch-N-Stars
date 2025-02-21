import React, { useState } from 'react';
import SubNav from '../components/SubNav';
import TppaPage from '../components/tppa/TppaPage';
import TargetSearch from '../components/framing/TargetSearch';
import InfoMount from '../components/mount/InfoMount';
import InfoCamera from '../components/camera/InfoCamera';
import ControlMount from '../components/mount/ControlMount';
import { useTranslation } from 'react-i18next';
import { useApiStore } from '../store/store';

const MountPage = () => {
  const [currentTab, setCurrentTab] = useState('showMount');
  const { t } = useTranslation();
  const store = useApiStore();

  return (
    <>
      <SubNav
        items={[
          { name: t('components.mount.title'), value: 'showMount' },
          { name: t('components.mount.slew'), value: 'showSlew' },
          { name: t('components.tppa.title'), value: 'showTppa' },
        ]}
        activeItem={currentTab}
        onUpdateActiveItem={setCurrentTab}
      />
      <div className="container py-16 flex items-center justify-center">
        <div className="container max-w-md landscape:max-w-xl">
          <h5 className="text-xl text-center font-bold text-white mb-4">
            {t('components.mount.title')}
          </h5>
          <InfoMount
            connected={store.mountInfo.Connected}
            className="gap-1 p-2 bg-gray-800/50 rounded-lg border border-gray-700/50"
          />
          <InfoCamera
            showOnlyExposing={currentTab === 'showTppa'}
            className="gap-1 p-2 bg-gray-800/50 rounded-lg border border-gray-700/50"
          />
          {store.mountInfo.Connected && (
            <div className="mt-4 border border-gray-700 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 shadow-lg">
              <div className="container pl-5 pb-5 pr-5">
                {currentTab === 'showMount' && (
                  <div className="mt-5">
                    <ControlMount />
                  </div>
                )}
                {currentTab === 'showTppa' && (
                  <div className="mt-5">
                    <TppaPage />
                  </div>
                )}
                {currentTab === 'showSlew' && (
                  <div className="mt-5">
                    <TargetSearch className="w-full mt-2" />
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default MountPage;
