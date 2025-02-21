<template>
  <!-- Fortschrittsbalken -->
  <div class="w-full rounded-lg overflow-hidden">
    <div
      class="bg-gradient-to-r from-blue-800 to-blue-200 transition-all duration-500 ease-linear"
      :style="{ width: cameraStore.exposureProgress + '%', height: '1px' }"
    ></div>
  </div>
</template>

<script setup>
import { watch, onMounted } from 'vue';
import { apiStore } from '@/store/store';
import { useCameraStore } from '@/store/cameraStore';

const store = apiStore();
const cameraStore = useCameraStore();

watch(
  () => store.cameraInfo.ExposureEndTime,
  (newVal) => {
    if (newVal && store.cameraInfo.IsExposing) {
      cameraStore.updateCountdown();
    }
  }
);

onMounted(() => {
  if (store.cameraInfo.ExposureEndTime) {
    cameraStore.updateCountdown();
  }
});
</script>
