<template>
  <div class="grid grid-cols-3 gap-4 p-4 place-items-center w-64 mx-auto">
    <!-- Obere Reihe (Nord) -->
    <div></div>
    <button @click="sendCommand('north')" class="btn">
      <ArrowUpCircleIcon
        :class="mountStore.lastDirection === 'north' ? 'text-green-500' : 'text-gray-400'"
        class="w-12 h-12"
      />
    </button>
    <div></div>

    <!-- Mittlere Reihe (West, Stop, Ost) -->
    <button @click="sendCommand('west')" class="btn">
      <ArrowLeftCircleIcon
        :class="mountStore.lastDirection === 'west' ? 'text-green-500' : 'text-gray-400'"
        class="w-12 h-12"
      />
    </button>
    <button @click="sendStop" class="btn btn-stop">
      <StopCircleIcon class="w-12 h-12 text-red-500" />
    </button>
    <button @click="sendCommand('east')" class="btn">
      <ArrowRightCircleIcon
        :class="mountStore.lastDirection === 'east' ? 'text-green-500' : 'text-gray-400'"
        class="w-12 h-12"
      />
    </button>

    <!-- Untere Reihe (Süd) -->
    <div></div>
    <button @click="sendCommand('south')" class="btn">
      <ArrowDownCircleIcon
        :class="mountStore.lastDirection === 'south' ? 'text-green-500' : 'text-gray-400'"
        class="w-12 h-12"
      />
    </button>
  </div>
  <div
    class="flex flex-row items-center justify-between w-full border border-gray-300 p-2 mt-1 rounded-xl transition-all duration-200 hover:border-cyan-500 focus-within:border-cyan-500 hover:shadow-lg"
  >
    <div>
      <p class="text-sm min-w-32 font-medium text-gray-500">
        {{ $t('components.mount.control.slewRate') }}
      </p>
    </div>
    <input
      class="w-full mx-2"
      type="range"
      min="0.1"
      max="5"
      step="0.1"
      v-model="settingsStore.mount.slewRate"
    />
    <input
      class="text-black px-4 h-10 w-20 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500 transition-all duration-200"
      type="number"
      v-model="settingsStore.mount.slewRate"
      min="0.1"
      max="5"
    />
  </div>
</template>

<script setup>
import apiService from '@/services/apiService';
import { useMountStore } from '@/store/mountStore';
import { useSettingsStore } from '@/store/settingsStore';
import {
  ArrowRightCircleIcon,
  ArrowLeftCircleIcon,
  ArrowDownCircleIcon,
  ArrowUpCircleIcon,
  StopCircleIcon,
} from '@heroicons/vue/24/outline';

const mountStore = useMountStore();
const settingsStore = useSettingsStore();

const sendCommand = async (direction) => {
  try {
    mountStore.lastDirection = direction; // Speichert die Richtung
    await apiService.moveAxis(direction, settingsStore.mount.slewRate); // Korrekte API-Aufruf-Syntax
    console.log(`Befehl gesendet: ${direction}`, settingsStore.mount.slewRate);
  } catch (error) {
    console.error(`Fehler beim Senden des Befehls ${direction}:`, error);
  }
};

const sendStop = async () => {
  if (!mountStore.lastDirection) {
    console.error('Kein vorheriger Befehl zum Stoppen.');
    return;
  }

  try {
    await apiService.moveAxisStop();
    mountStore.lastDirection = '';
    console.log(`Stop-Befehl gesendet für: ${mountStore.lastDirection}`);
  } catch (error) {
    console.error('Fehler beim Senden des Stop-Befehls:', error);
  }
};
</script>

<style scoped>
.btn {
  border-radius: 1rem; /* entspricht rounded-2xl */
  background-color: #334155; /* entspricht bg-slate-700 */
  padding: 0.5rem; /* entspricht px-2 */
  box-shadow: 0 2px 15px black; /* entspricht shadow-lg shadow-black */
  border: 1px solid #0a0a0a; /* entspricht border border-gray-800 */
}
</style>
