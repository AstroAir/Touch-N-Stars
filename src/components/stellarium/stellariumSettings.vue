<template>
  <div>
    <button
      @click="toggleControls"
      class="p-2 bg-gray-700 border border-cyan-600 rounded-full shadow-md"
      :class="{ 'bg-cyan-600': settingsVisible }"
    >
      <Cog6ToothIcon class="w-7 h-7" />
    </button>
  </div>
  <!-- Date/Time Control Panel -->
  <div
    v-if="settingsVisible"
    class="fixed inset-0 z-50 flex items-start justify-center pt-24 bg-transparent"
    @click.self="settingsVisible = false"
  >
    <div
      v-if="settingsVisible"
      class="absolute flex flex-col gap-1 top-22 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-80 p-4 rounded-lg shadow-lg text-white w-72"
    >
      <div
        class="flex flex-row items-center justify-between w-full border border-gray-500 p-2 rounded-lg"
      >
        <label for="constellationsLinesVisible" class="text-gray-400">
          {{ $t('components.stellarium.settings.constellations_lines_visible') }}
        </label>
        <div>
          <toggleButton
            @click="
              settingsStore.stellarium.constellationsLinesVisible =
                !settingsStore.stellarium.constellationsLinesVisible
            "
            :status-value="settingsStore.stellarium.constellationsLinesVisible"
          />
        </div>
      </div>

      <div
        class="flex flex-row items-center justify-between w-full border border-gray-500 p-2 rounded-lg"
      >
        <label for="azimuthalLinesVisible" class="text-gray-400">
          {{ $t('components.stellarium.settings.azimuthal_lines_visible') }}
        </label>
        <div>
          <toggleButton
            @click="
              settingsStore.stellarium.azimuthalLinesVisible =
                !settingsStore.stellarium.azimuthalLinesVisible
            "
            :status-value="settingsStore.stellarium.azimuthalLinesVisible"
          />
        </div>
      </div>

      <div
        class="flex flex-row items-center justify-between w-full border border-gray-500 p-2 rounded-lg"
      >
        <label for="equatorialLinesVisible" class="text-gray-400">
          {{ $t('components.stellarium.settings.equatorial_lines_visible') }}
        </label>
        <div>
          <toggleButton
            @click="
              settingsStore.stellarium.equatorialLinesVisible =
                !settingsStore.stellarium.equatorialLinesVisible
            "
            :status-value="settingsStore.stellarium.equatorialLinesVisible"
          />
        </div>
      </div>

      <div
        class="flex flex-row items-center justify-between w-full border border-gray-500 p-2 rounded-lg"
      >
        <label for="meridianLinesVisible" class="text-gray-400">
          {{ $t('components.stellarium.settings.meridian_lines_visible') }}
        </label>
        <div>
          <toggleButton
            @click="
              settingsStore.stellarium.meridianLinesVisible =
                !settingsStore.stellarium.meridianLinesVisible
            "
            :status-value="settingsStore.stellarium.meridianLinesVisible"
          />
        </div>
      </div>

      <div
        class="flex flex-row items-center justify-between w-full border border-gray-500 p-2 rounded-lg"
      >
        <label for="eclipticLinesVisible" class="text-gray-400">
          {{ $t('components.stellarium.settings.ecliptic_lines_visible') }}
        </label>
        <div>
          <toggleButton
            @click="
              settingsStore.stellarium.eclipticLinesVisible =
                !settingsStore.stellarium.eclipticLinesVisible
            "
            :status-value="settingsStore.stellarium.eclipticLinesVisible"
          />
        </div>
      </div>

      <div
        class="flex flex-row items-center justify-between w-full border border-gray-500 p-2 rounded-lg"
      >
        <label for="atmosphereVisible" class="text-gray-400">
          {{ $t('components.stellarium.settings.atmosphere_visible') }}
        </label>
        <div>
          <toggleButton
            @click="
              settingsStore.stellarium.atmosphereVisible =
                !settingsStore.stellarium.atmosphereVisible
            "
            :status-value="settingsStore.stellarium.atmosphereVisible"
          />
        </div>
      </div>

      <div
        class="flex flex-row items-center justify-between w-full border border-gray-500 p-2 rounded-lg"
      >
        <label for="landscapesVisible" class="text-gray-400">
          {{ $t('components.stellarium.settings.landscapes_visible') }}
        </label>
        <div>
          <toggleButton
            @click="
              settingsStore.stellarium.landscapesVisible =
                !settingsStore.stellarium.landscapesVisible
            "
            :status-value="settingsStore.stellarium.landscapesVisible"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStellariumStore } from '@/store/stellariumStore';
import { useSettingsStore } from '@/store/settingsStore';
import toggleButton from '@/components/helpers/toggleButton.vue';
import { watch, ref } from 'vue';
import { Cog6ToothIcon } from '@heroicons/vue/24/outline';

const stellariumStore = useStellariumStore();
const settingsStore = useSettingsStore();
const settingsVisible = ref(false);

function toggleControls() {
  settingsVisible.value = !settingsVisible.value;
}

watch(() => settingsStore.stellarium, stellariumStore.updateStellariumCore, { deep: true });
</script>
