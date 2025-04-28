import React, { useState } from 'react';
import CenterHere from '../components/camera/CenterHere';
import InfoCamera from '../components/camera/InfoCamera';
import CaptureButton from '../components/camera/CaptureButton';
import ImageModal from '../components/helpers/ImageModal';
import settingsCamera from '../components/camera/settingsCamera';
import settingsCameraCooler from '../components/camera/settingsCameraCooler';
import changeFilter from '../components/filterwheel/changeFilter';
import controlRotator from '../components/rotator/controlRotator';
import infoRotator from '../components/rotator/infoRotator';
import settingsSensor from '../components/camera/settingsSensor';

const CameraPage = () => {
  const [showInfo, setShowInfo] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [slewModal, setSlewModal] = useState(false);
  const [isLooping, setIsLooping] = useState(false);
  const [imageData, setImageData] = useState(null);
  const [plateSolveResult, setPlateSolveResult] = useState(null);
  const [cameraInfo, setCameraInfo] = useState({ Connected: false, CanSetTemperature: false });
  const [rotatorInfo, setRotatorInfo] = useState({ Connected: false });
  const [filterInfo, setFilterInfo] = useState({ Connected: false });

  const openModal = () => setShowModal(true);
  const closeModal = () => setShowModal(false);

  return (
    <div className="text-center">
      <div className="text-left mb-2">
        <h1 className="text-xl text-center font-bold">Camera</h1>
      </div>

      <div className="w-full flex justify-center mb-3">
        <div className="max-w-xl">
          {!cameraInfo.Connected && (
            <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
              <p className="text-red-400 font-medium">Please connect the camera</p>
            </div>
          )}

          {showInfo && (
            <div className="space-y-6">
              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-gray-700"></div>
                <span className="flex-shrink mx-4 text-sm font-semibold text-cyan-400">Info</span>
                <div className="flex-grow border-t border-gray-700"></div>
              </div>
              <div className="container flex items-center justify-center space-x-1">
                <div className="container space-y-1 max-w-md lg:max-w-xl">
                  <div className="w-full p-2 bg-gray-800/50 rounded-lg border border-gray-700/50">
                    <label htmlFor="infoCamera" className="text-xs mb-1 text-gray-400">
                      Camera
                    </label>
                    <InfoCamera
                      connected={cameraInfo.Connected}
                      showAllInfo={true}
                      className="grid grid-cols-2 lg:grid-cols-3"
                    />
                  </div>
                  {rotatorInfo.Connected && (
                    <div className="w-full p-2 bg-gray-800/50 rounded-lg border border-gray-700/50">
                      <label htmlFor="infoRotator" className="text-xs mb-1 text-gray-400">
                        Rotator
                      </label>
                      <infoRotator className="grid grid-cols-2 lg:grid-cols-3" />
                    </div>
                  )}
                </div>
              </div>

              <div className="relative flex items-center py-4">
                <div className="flex-grow border-t border-gray-700"></div>
                <span className="flex-shrink mx-4 text-sm font-semibold text-cyan-400">Settings</span>
                <div className="flex-grow border-t border-gray-700"></div>
              </div>

              <div className="space-y-1">
                <settingsSensor className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50" />
                {cameraInfo.CanSetTemperature && (
                  <settingsCameraCooler className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50" />
                )}
                {filterInfo.Connected && (
                  <changeFilter className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50" />
                )}
                {rotatorInfo.Connected && (
                  <controlRotator className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50" />
                )}
                <settingsCamera className="p-4 bg-gray-800/50 rounded-lg border border-gray-700/50" />
              </div>
            </div>
          )}
        </div>
      </div>

      {cameraInfo.Connected && (
        <div className="pb-14">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-3 h-[1px] bg-gray-700"></div>
            <button
              onClick={() => setShowInfo(!showInfo)}
              className="w-7 h-7 bg-gray-700 active:bg-cyan-700 hover:bg-cyan-600 rounded-md border border-cyan-500/20 flex items-center justify-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 text-white transition-transform duration-300 ${showInfo ? '-rotate-90' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7" />
              </svg>
            </button>
            <p className="text-sm italic">Info & Settings</p>
            <div className="flex-grow h-[1px] bg-gray-700"></div>
          </div>

          <div className="flex flex-col lg:flex-row gap-1 lg:gap-4 mx-5">
            <div className="flex flex-col lg:w-2/6 space-y-3 min-h-[100px] lg:min-h-0">
              <div className="flex items-center p-4 bg-gray-800/50 rounded-lg border border-gray-700/50">
                <input
                  checked={isLooping}
                  onChange={() => setIsLooping(!isLooping)}
                  id="checkDauerschleife"
                  type="checkbox"
                  className="w-5 h-5 text-cyan-500 bg-gray-700 border-gray-600 rounded focus:ring-cyan-500 focus:ring-2"
                />
                <label htmlFor="checkDauerschleife" className="ms-3 text-sm font-medium text-gray-300">
                  Loop
                </label>
              </div>

              <div className="flex flex-col space-y-2">
                <CaptureButton />
              </div>
            </div>

            <div className="flex w-full lg:w-5/6 relative">
              <div
                className="image-container overflow-hidden w-full touch-auto bg-gray-800 shadow-lg shadow-cyan-700/40 rounded-xl border border-cyan-700/50 flex-grow"
              >
                {imageData ? (
                  <img
                    onClick={openModal}
                    src={imageData}
                    alt="Captured Image"
                    className="block"
                  />
                ) : (
                  <div className="flex items-center justify-center">
                    <img
                      src="../assets/Logo_TouchNStars_600x600.png"
                      alt="Captured Image"
                      className="block"
                    />
                  </div>
                )}
                {imageData && plateSolveResult?.Coordinates?.RADegrees && (
                  <div className="absolute top-2 right-2 z-50">
                    <svg
                      onClick={() => setSlewModal(true)}
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      className="w-10 h-10 text-white cursor-pointer hover:text-cyan-500 transition"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 9V4.5M9 9H4.5M9 9 3.75 3.75M9 15v4.5M9 15H4.5M9 15l-5.25 5.25M15 9h4.5M15 9V4.5M15 9l5.25-5.25M15 15h4.5M15 15v4.5m0-4.5 5.25 5.25"
                      />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      <ImageModal
        showModal={showModal}
        imageData={imageData}
        isLoading={false}
        onClose={closeModal}
      />

      {slewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-gray-900 rounded-lg p-4 overflow-y-auto max-h-[95vh] border border-gray-700 scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800/50">
            <CenterHere />
            <button
              onClick={() => setSlewModal(false)}
              className="fixed sm:absolute top-2 right-2 sm:top-4 sm:right-4 p-2 text-gray-400 hover:text-white bg-gray-900 rounded-full"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CameraPage;
