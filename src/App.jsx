import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import NavigationComp from './components/NavigationComp';
import SettingsPage from './views/SettingsPage';
import LastLogs from './components/LastLogs';
import TutorialModal from './components/TutorialModal';
import { useStore } from './store/store';
import { useSettingsStore } from './store/settingsStore';
import { useLogStore } from './store/logStore';

const App = () => {
  const store = useStore();
  const settingsStore = useSettingsStore();
  const logStore = useLogStore();
  const [showLogsModal, setShowLogsModal] = useState(false);
  const [showTutorial, setShowTutorial] = useState(false);

  useEffect(() => {
    document.addEventListener('visibilitychange', handleVisibilityChange);
    store.startFetchingInfo();
    logStore.startFetchingLog();

    // Initialize language from settings store
    // locale.value = settingsStore.getLanguage();

    // Show tutorial on first visit
    if (!settingsStore.tutorial.completed) {
      setShowTutorial(true);
    }

    return () => {
      store.stopFetchingInfo();
      logStore.stopFetchingLog();
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, []);

  const handleVisibilityChange = () => {
    if (document.hidden) {
      store.stopFetchingInfo();
      logStore.stopFetchingLog();
    } else {
      store.startFetchingInfo();
      logStore.startFetchingLog();
    }
  };

  const closeTutorial = () => {
    setShowTutorial(false);
    settingsStore.completeTutorial();
  };

  return (
    <div className="dark min-h-screen bg-gray-900 text-white">
      <Router>
        <div>
          {/* Navigation */}
          <nav>
            <div className="z-20">
              <NavigationComp />
            </div>
          </nav>
          {/* Main content */}
          {!store.isBackendReachable && !store.showSettings && settingsStore.setupCompleted && (
            <div className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none">
              <div className="animate-spin rounded-full h-20 w-20 border-t-8 border-red-600"></div>
            </div>
          )}

          <div className="container mx-auto p-0.5 transition-all">
            <Switch>
              {/* Add your routes here */}
            </Switch>
          </div>
          {/* Footer */}
          {settingsStore.setupCompleted && (
            <button onClick={() => setShowLogsModal(true)} className="fixed bottom-0 w-full">
              <LastMessage className="fixed bottom-0 w-full" />
            </button>
          )}
        </div>

        {/* Settings Modal */}
        {store.showSettings && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-900 rounded-lg p-4 sm:p-6 w-full sm:max-w-2xl h-full sm:h-auto sm:max-h-[90vh] overflow-y-auto mx-2 sm:mx-0 scrollbar-hide">
              <SettingsPage />
              <button
                onClick={() => (store.showSettings = false)}
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

        {/* Logs Modal */}
        {showLogsModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <div className="bg-gray-900 rounded-lg p-4 sm:p-6 w-full sm:max-w-4xl h-full sm:h-auto sm:max-h-[90vh] overflow-y-auto mx-2 sm:mx-0 scrollbar-hide">
              <LastLogs />
              <button
                onClick={() => setShowLogsModal(false)}
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

        {/* Tutorial Modal */}
        {showTutorial && <TutorialModal steps={settingsStore.tutorial.steps} onClose={closeTutorial} />}
      </Router>
    </div>
  );
};

export default App;
