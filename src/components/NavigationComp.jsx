import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LinkIcon,
  CameraIcon,
  EyeIcon,
  ListBulletIcon,
  Cog6ToothIcon,
  LightBulbIcon,
  AdjustmentsVerticalIcon,
} from '@heroicons/react/outline';
import { useStore } from '../store/store';

const NavigationComp = () => {
  const store = useStore();

  return (
    <div className="flex top-0 bg-gray-800 shadow-md overflow-hidden justify-center h-20">
      <div
        className="flex mx-auto items-center justify-start overflow-x-auto overflow-y-hidden scrollbar-hide"
        style={{ scrollSnapType: 'x mandatory' }}
      >
        <div className="flex space-x-2 px-2" style={{ scrollSnapAlign: 'start' }}>
          {store.isBackendReachable && (
            <NavLink
              to="/equipment"
              className="nav-button"
              activeClassName="active-nav-button"
              title="Equipment"
            >
              <LinkIcon className="icon" />
            </NavLink>
          )}
          {store.cameraInfo.Connected && !store.sequenceRunning && (
            <NavLink
              to="/camera"
              className="nav-button"
              activeClassName="active-nav-button"
              title="Camera"
            >
              <CameraIcon
                className={`icon ${store.cameraInfo.IsExposing ? 'text-green-500' : 'text-white'}`}
              />
            </NavLink>
          )}
          {store.focuserInfo.Connected && !store.sequenceRunning && (
            <NavLink
              to="/autofocus"
              className="nav-button"
              activeClassName="active-nav-button"
              title="Autofocus"
            >
              <EyeIcon className="icon" />
            </NavLink>
          )}
          {store.mountInfo.Connected && !store.sequenceRunning && (
            <NavLink
              to="/mount"
              className="nav-button"
              activeClassName="active-nav-button"
              title="Mount"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`icon ${
                  store.mountInfo.AtPark
                    ? 'text-red-500'
                    : !store.mountInfo.TrackingEnabled
                    ? 'text-yellow-500'
                    : 'text-green-500'
                }`}
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M6 21l6 -5l6 5" />
                <path d="M12 13v8" />
                <path
                  d="M3.294 13.678l.166 .281c.52 .88 1.624 1.265 2.605 .91l14.242 -5.165a1.023 1.023 0 0 0 .565 -1.456l-2.62 -4.705a1.087 1.087 0 0 0 -1.447 -.42l-.056 .032l-12.694 7.618c-1.02 .613 -1.357 1.897 -.76 2.905z"
                />
                <path d="M14 5l3 5.5" />
              </svg>
            </NavLink>
          )}
          {store.domeInfo.Connected && !store.sequenceRunning && (
            <NavLink
              to="/dome"
              className="nav-button"
              activeClassName="active-nav-button"
              title="Dome"
            >
              <svg
                fill="#FFFFFF"
                height="24"
                width="24"
                version="1.1"
                id="Layer_1"
                xmlns="http://www.w3.org/2000/svg"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                viewBox="0 0 512 512"
                xmlSpace="preserve"
              >
                <path
                  d="M256,114.383c-22.526,0-40.851,18.325-40.851,40.851s18.325,40.851,40.851,40.851s40.851-18.325,40.851-40.851
                  S278.526,114.383,256,114.383z M256,179.745c-13.516,0-24.511-10.995-24.511-24.511c0-13.516,10.995-24.511,24.511-24.511
                  s24.511,10.995,24.511,24.511C280.511,168.75,269.516,179.745,256,179.745z"
                />
                <path
                  d="M495.66,283.234h-2.723v-38.128h2.723c4.512,0,8.17-3.658,8.17-8.17c0-4.512-3.658-8.17-8.17-8.17h-2.878
                  c-2.027-60.223-26.424-116.55-69.243-159.369c-26.822-26.822-58.948-46.412-94.006-57.812V8.45c0-4.512-3.658-8.17-8.17-8.17
                  c-3.999,0-7.322,2.876-8.026,6.671C294.802,2.366,275.583,0,256,0c-19.714,0-39.059,2.393-57.707,7.038
                  c-1.154-3.113-4.141-5.337-7.655-5.337c-4.512,0-8.17,3.658-8.17,8.17v1.714c-35.06,11.399-67.184,30.989-94.008,57.812
                  c-42.82,42.818-67.215,99.144-69.242,159.368H16.34c-4.512,0-8.17,3.658-8.17,8.17c0,4.512,3.658,8.17,8.17,8.17h2.723v38.128
                  H16.34c-4.512,0-8.17,3.658-8.17,8.17c0,4.512,3.658,8.17,8.17,8.17h2.723V503.83c0,4.512,3.658,8.17,8.17,8.17h457.532
                  c4.512,0,8.17-3.658,8.17-8.17V299.574h2.723c4.512,0,8.17-3.658,8.17-8.17C503.83,286.892,500.172,283.234,495.66,283.234z
                  M198.809,23.874c18.248-4.903,37.417-7.534,57.191-7.534c19.774,0,38.944,2.631,57.191,7.534v41.487H198.809V23.874z
                  M182.468,28.958v175.297c0,4.512,3.658,8.17,8.17,8.17s8.17-3.658,8.17-8.17V81.702h114.383v122.553
                  c0,4.512,3.658,8.17,8.17,8.17s8.17-3.658,8.17-8.17V28.958C412.68,58.443,473.049,136.45,476.429,228.766H35.571
                  C38.951,136.45,99.32,58.443,182.468,28.958z M247.83,495.66h-49.021V343.149h49.021V495.66z M313.191,495.66H264.17V343.149
                  h49.021V495.66z M476.596,283.234h-367.66c-4.512,0-8.17,3.658-8.17,8.17c0,4.512,3.658,8.17,8.17,8.17h367.66V495.66H329.532
                  V334.979c0-4.512-3.658-8.17-8.17-8.17H190.638c-4.512,0-8.17,3.658-8.17,8.17V495.66H35.404V299.574h40.851
                  c4.512,0,8.17-3.658,8.17-8.17c0-4.512-3.658-8.17-8.17-8.17H35.404v-38.128h49.021v13.617c0,4.512,3.658,8.17,8.17,8.17
                  s8.17-3.658,8.17-8.17v-13.617h49.021v13.617c0,4.512,3.658,8.17,8.17,8.17s8.17-3.658,8.17-8.17v-13.617h49.021v13.617
                  c0,4.512,3.658,8.17,8.17,8.17s8.17-3.658,8.17-8.17v-13.617h49.021v13.617c0,4.512,3.658,8.17,8.17,8.17s8.17-3.658,8.17-8.17
                  v-13.617h49.021v13.617c0,4.512,3.658,8.17,8.17,8.17c4.512,0,8.17-3.658,8.17-8.17v-13.617h49.021V283.234z"
                />
                <path
                  d="M354.043,359.489c-4.512,0-8.17,3.658-8.17,8.17v43.574c0,4.512,3.658,8.17,8.17,8.17s8.17-3.658,8.17-8.17V367.66 
                  C362.213,363.147,358.555,359.489,354.043,359.489z"
                />
                <path
                  d="M157.957,359.489c-4.512,0-8.17,3.658-8.17,8.17v43.574c0,4.512,3.658,8.17,8.17,8.17s8.17-3.658,8.17-8.17V367.66
                  C166.128,363.147,162.47,359.489,157.957,359.489z"
                />
              </svg>
            </NavLink>
          )}
          {store.flatdeviceInfo.Connected && !store.sequenceRunning && (
            <NavLink to="/flat" className="nav-button" activeClassName="active-nav-button">
              <LightBulbIcon
                className={`icon ${
                  store.flatdeviceInfo.CoverState === 'Closed'
                    ? 'text-red-500'
                    : store.flatdeviceInfo.LightOn
                    ? 'text-yellow-300'
                    : 'text-white'
                }`}
              />
            </NavLink>
          )}
          {store.switchInfo.Connected && (
            <NavLink to="/switch" className="nav-button" activeClassName="active-nav-button">
              <AdjustmentsVerticalIcon className="icon" />
            </NavLink>
          )}
          {store.guiderInfo.Connected && (
            <NavLink
              to="/guider"
              className="nav-button"
              activeClassName="active-nav-button"
              title="Guider"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className={`icon ${
                  store.guiderInfo.State === 'Guiding' ? 'text-green-500' : 'text-white'
                }`}
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path d="M12 12m-9 0a9 9 0 1 0 18 0a9 9 0 1 0 -18 0" />
                <path d="M12 3l0 4" />
                <path d="M12 21l0 -3" />
                <path d="M3 12l4 0" />
                <path d="M21 12l-3 0" />
                <path d="M12 12l0 .01" />
              </svg>
            </NavLink>
          )}
          {store.sequenceIsLoaded && (
            <NavLink
              to="/sequence"
              className="nav-button"
              activeClassName="active-nav-button"
              title="Sequence"
            >
              <ListBulletIcon
                className={`icon ${store.sequenceRunning ? 'text-green-500' : 'text-white'}`}
              />
            </NavLink>
          )}
          {(store.sequenceRunning ||
            (store.imageHistoryInfo && store.imageHistoryInfo.length > 0)) && (
            <NavLink
              to="/seq-mon"
              className="nav-button"
              activeClassName="active-nav-button"
              title="Sequence Monitoring"
            >
              <svg
                fill="#FFFFFF"
                height="400px"
                width="400px"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="-100 0 639.479 439.479"
                xmlnsXlink="http://www.w3.org/1999/xlink"
                enableBackground="new 0 0 439.479 439.479"
              >
                <g>
                  <path
                    d="m407.18,60.082h-374.882c-17.81,0-32.298,14.489-32.298,32.299v226.626c0,17.81 14.488,32.299 32.298,32.299h106.252l-12.162,13.091h-18.23c-4.143,0-7.5,3.358-7.5,7.5s3.357,7.5 7.5,7.5h223.162c4.143,0 7.5-3.358 7.5-7.5s-3.357-7.5-7.5-7.5h-18.23l-12.162-13.091h106.252c17.81,0 32.299-14.489 32.299-32.299v-226.626c0-17.81-14.49-32.299-32.299-32.299zm-392.18,250.422v-209.62h409.479v209.621h-409.479zm17.298-235.423h374.882c7.24,0 13.447,4.475 16.021,10.801h-406.924c2.575-6.325 8.781-10.801 16.021-10.801zm260.318,289.314h-145.754l12.162-13.091h121.43l12.162,13.091zm114.564-28.09h-374.882c-7.24,0-13.446-4.475-16.021-10.801h406.924c-2.575,6.325-8.781,10.801-16.021,10.801z"
                  />
                  <path
                    d="m374.171,159.137c-9.064-9.064-23.814-9.065-32.879,0-4.392,4.391-6.811,10.23-6.811,16.44 0,3.34 0.721,6.562 2.051,9.52l-59.872,47.207c-6.806-3.618-15.042-3.618-21.847,0l-59.883-47.216c3.825-8.549 2.259-18.944-4.748-25.95-9.065-9.064-23.813-9.066-32.88,0-7.006,7.007-8.573,17.401-4.748,25.95l-59.883,47.216c-8.789-4.672-19.965-3.317-27.363,4.08-9.064,9.065-9.064,23.814 0,32.879 4.533,4.532 10.486,6.799 16.439,6.799 5.954,0 11.907-2.266 16.44-6.799 7.006-7.007 8.573-17.401 4.748-25.95l59.883-47.216c3.403,1.809 7.162,2.719 10.923,2.719 3.762,0 7.521-0.91 10.924-2.719l59.883,47.216c-3.825,8.549-2.259,18.944 4.748,25.95 4.533,4.533 10.485,6.798 16.44,6.798 5.952,0 11.907-2.266 16.439-6.798 0,0 0,0 0.001,0 7.006-7.007 8.572-17.401 4.747-25.95l59.884-47.216c3.403,1.809 7.162,2.719 10.924,2.719 5.953,0 11.906-2.266 16.439-6.799 9.065-9.065 9.065-23.815 0.001-32.88zm-286.591,99.519c-3.214,3.216-8.449,3.217-11.665,0-3.217-3.217-3.217-8.45 0-11.666 1.607-1.608 3.72-2.412 5.832-2.412 2.113,0 4.226,0.804 5.833,2.412 3.217,3.216 3.217,8.45 1.42109e-14,11.666zm80.329-77.246c-3.217-3.217-3.217-8.45 0-11.666 1.607-1.608 3.72-2.412 5.832-2.412 2.113,0 4.226,0.804 5.833,2.412 3.217,3.217 3.217,8.45 0,11.666-3.213,3.216-8.448,3.217-11.665,0zm103.661,77.246c-3.217,3.217-8.452,3.216-11.667,0-3.217-3.217-3.217-8.45 0-11.666 1.607-1.608 3.72-2.412 5.833-2.412 2.112,0 4.226,0.804 5.833,2.412 3.217,3.216 3.217,8.45 0.001,11.666zm91.993-77.246c-3.215,3.216-8.449,3.216-11.666,0-1.559-1.558-2.416-3.629-2.416-5.833 0-2.203 0.857-4.275 2.417-5.833 1.607-1.608 3.72-2.412 5.833-2.412 2.112,0 4.225,0.804 5.832,2.412 3.217,3.216 3.217,8.449 0,11.666z"
                  />
                </g>
              </svg>
            </NavLink>
          )}
          <button
            onClick={() => (store.showSettings = true)}
            className="nav-button"
            activeClassName="active-nav-button"
            title="Settings"
          >
            <Cog6ToothIcon className="icon" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default NavigationComp;
