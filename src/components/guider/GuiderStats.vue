<template>
  <div>
    <div class="text-sm text-gray-300 p-2">
      <p class="">{{ $t('components.guider.rms_error') }}</p>
      <p>RA: {{ store.guiderInfo.RMSError.RA.Arcseconds.toFixed(2) }}</p>
      <p>DEC: {{ store.guiderInfo.RMSError.Dec.Arcseconds.toFixed(2) }}</p>
      <p>Total: {{ store.guiderInfo.RMSError.Total.Arcseconds.toFixed(2) }}</p>
    </div>
  </div>
</template>

<script setup>
import { apiStore } from '@/store/store';

const store = apiStore();
</script>

<style scoped></style>
