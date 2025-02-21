import React, { useState, useEffect } from 'react';
import apiService from '@/services/apiService';
import infoFocuser from '@/components/focuser/infoFocuser';
import AutofocusGrafik from '@/components/focuser/AutofocusGrafik';
import { useStore } from '@/store/store';

const FocusPage = () => {
  const store = useStore();
  const [position, setPosition] = useState(0);
  const [loading, setLoading] = useState(false);
  const [delayShowGraph, setDelayShowGraph] = useState(true);

  useEffect(() => {
    setPosition(store.focuserInfo.Position || 100);
  }, [store.focuserInfo.Position]);

  const moveFocuser = async () => {
    try {
      setLoading(true);
      await apiService.moveFocuser(position);
    } catch (error) {
      console.error('Error moving focuser:', error);
    } finally {
      setLoading(false);
    }
  };

  const startAutofocus = async () => {
    try {
      await apiService.focuserAfAction('start');
    } catch (error) {
      console.error('Error starting autofocus:', error);
    }
  };

  const stopAutofocus = async () => {
    try {
      await apiService.focuserAfAction('stop');
    } catch (error) {
      console.error('Error stopping autofocus:', error);
    }
  };

  useEffect(() => {
    if (!store.focuserAfInfo.autofocus_running) {
      setDelayShowGraph(false);
      setTimeout(() => {
        setDelayShowGraph(true);
      }, 5000);
    }
  }, [store.focuserAfInfo.autofocus_running]);

  return (
    <div className="text-left mb-2">
      <h1 className="text-xl text-center font-bold">Focuser</h1>
      {!store.focuserInfo.Connected ? (
        <div className="p-4 bg-red-500/10 border border-red-500/30 rounded-lg">
          <p className="text-red-400 font-medium text-center">Please connect the focuser</p>
        </div>
      ) : (
        <div className="container flex items-center justify-center">
          <div className="container max-w-md landscape:max-w-xl">
            <infoFocuser
              connected={store.focuserInfo.Connected}
              className="grid grid-cols-2 landscape:grid-cols-3"
            />
            {store.focuserInfo.Connected && (
              <div className="flex flex-col text-left mt-4">
                <div className="flex space-x-3 items-center">
                  <label htmlFor="position" className="w-auto">New Position</label>
                  <input
                    id="position"
                    value={position}
                    onChange={(e) => setPosition(Number(e.target.value))}
                    type="number"
                    className="text-black px-4 h-10 w-full border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-700"
                    placeholder="1"
                    step="50"
                  />
                  <button
                    className="btn-primary bg-gradient-to-br from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 w-full"
                    onClick={moveFocuser}
                  >
                    Move
                  </button>
                </div>
                <div className="mt-4">
                  {!store.focuserAfInfo.autofocus_running ? (
                    <button
                      className="btn-primary bg-gradient-to-br from-cyan-600 to-cyan-500 hover:from-cyan-700 hover:to-cyan-600 flex h-10 w-full"
                      onClick={startAutofocus}
                    >
                      Start Autofocus
                    </button>
                  ) : (
                    <button
                      className="flex h-10 w-full rounded-md text-white font-medium transition-colors bg-red-700 items-center justify-center disabled:opacity-50"
                      onClick={stopAutofocus}
                    >
                      Cancel Autofocus
                    </button>
                  )}
                </div>
                <div className="flex items-center space-x-3 mt-4">
                  <div className="w-3 h-[1px] bg-gray-700"></div>
                  <button
                    onClick={() => store.showAfGraph = !store.showAfGraph}
                    className="w-7 h-7 bg-gray-700 active:bg-cyan-700 hover:bg-cyan-600 rounded-md border border-cyan-500/20 flex items-center justify-center"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 text-white transition-transform duration-300"
                      className={store.showAfGraph ? 'rotate-90' : ''}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                  <p className="text-sm italic">Autofocus Graph</p>
                  <div className="flex-grow h-[1px] bg-gray-700"></div>
                </div>
                {store.showAfGraph && (
                  <div className="mt-6">
                    {store.focuserAfInfo.autofocus_running || !delayShowGraph ? (
                      <div role="status" className="flex flex-col items-center h-screen mt-4 text-center">
                        <svg
                          aria-hidden="true"
                          className="w-8 h-8 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                          viewBox="0 0 100 101"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                            fill="currentColor"
                          />
                          <path
                            d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                            fill="currentFill"
                          />
                        </svg>
                        <span className="sr-only">Loading</span>
                      </div>
                    ) : !store.focuserAfInfo.afError ? (
                      <div>
                        <p className="mb-4 text-center">Last Autofocus</p>
                        <AutofocusGrafik className="flex-grow h-screen" />
                      </div>
                    ) : (
                      <div className="text-center text-red-600">
                        <p>Autofocus Error</p>
                        <p className="italic">{store.focuserAfInfo.afErrorText}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default FocusPage;
