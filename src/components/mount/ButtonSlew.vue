<template>
  <div class="flex gap-1">
    <button
      @click="slew"
      :disabled="
        framingStore.isSlewing ||
        framingStore.isSlewingAndCentering ||
        framingStore.isRotating ||
        props.disabled
      "
      class="default-button-cyan px-5"
    >
      <span v-if="framingStore.isSlewing" class="loader mr-2"></span>
      <p v-if="label">{{ label }}</p>
      <p v-else>{{ $t('components.slewAndCenter.slew') }}</p>
    </button>
    <div class="default-button-red w-16" v-if="store.mountInfo.Slewing">
      <ButtonSlewStop />
    </div>
  </div>
</template>

<script setup>
import { defineProps, defineEmits } from 'vue';
import apiService from '@/services/apiService';
import { apiStore } from '@/store/store';
import { useFramingStore } from '@/store/framingStore';
import { useI18n } from 'vue-i18n';
import { wait } from '@/utils/utils';
import ButtonSlewStop from '@/components/mount/ButtonSlewStop.vue';
import { handleApiError } from '@/utils/utils';

const store = apiStore();
const framingStore = useFramingStore();
const { t } = useI18n();

const props = defineProps({
  raAngle: Number,
  decAngle: Number,
  label: String,
  disabled: Boolean,
});
const emit = defineEmits(['finished']);

async function unparkMount() {
  if (store.mountInfo.AtPark) {
    try {
      const response = await apiService.mountAction('unpark');
      if (handleApiError(response, { title: 'Mount error' })) return;
      await wait(2000);
      console.log(t('components.mount.control.unpark'));
    } catch (error) {
      console.log(t('components.mount.control.errors.unpark'));
    }
  }
}

async function slew() {
  await unparkMount(); // Überprüfen und Entparken, falls erforderlich
  await framingStore.slew(props.raAngle, props.decAngle);
  emit('finished'); // Emit Event nach Erfolg
}
</script>

<style scoped>
.loader {
  border: 2px solid #f3f3f3;
  border-top: 2px solid #3498db;
  border-radius: 50%;
  width: 16px;
  height: 16px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}
</style>
