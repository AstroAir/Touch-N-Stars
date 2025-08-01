<template>
  <teleport to="body">
    <div v-if="show" class="fixed inset-0 z-40 text-gray-200 p-2 pointer-events-none">
      <div
        ref="modalElement"
        class="p-6 bg-gradient-to-br from-gray-950/20 rounded-lg shadow-lg w-80 sm:w-96 relative pointer-events-auto touch-none"
        :style="{ position: 'absolute', ...position }"
        @click.stop
      >
        <!-- Header = Drag-Handle -->
        <div
          class="mb-4 border-b pb-2 flex justify-between items-center cursor-move select-none touch-none"
          @mousedown="startDrag"
          @touchstart="startDrag"
        >
          <slot name="header">
            <h2 class="text-xl font-bold">Standard Titel</h2>
          </slot>
          <button @click="emit('close')" class="w-8 h-8 text-gray-400 hover:text-gray-600">
            <XMarkIcon />
          </button>
        </div>
        <!-- Body -->
        <div
          class="flex justify-center mb-4 max-h-[60vh] overflow-y-auto scrollbar-thin modal-content"
        >
          <slot name="body">
            <p>Standard-Inhalt</p>
          </slot>
        </div>
      </div>
    </div>
  </teleport>
</template>

<script setup>
import { ref, watch, nextTick } from 'vue';
import { XMarkIcon } from '@heroicons/vue/24/outline';

const props = defineProps({
  show: Boolean,
});

const emit = defineEmits(['close']);

const modalElement = ref(null);
const position = ref({ top: '50%', left: '50%', transform: 'translate(-50%, -50%)' });
const isDragging = ref(false);
const hasBeenMoved = ref(false); // Track ob das Modal schon mal bewegt wurde
let offset = { x: 0, y: 0 };

function getEventCoordinates(e) {
  if (e.touches) {
    return {
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    };
  }
  return {
    x: e.clientX,
    y: e.clientY,
  };
}

function startDrag(e) {
  isDragging.value = true;
  hasBeenMoved.value = true; // Markiere als bewegt
  const { x, y } = getEventCoordinates(e);

  // Berechne die aktuelle Position des Modals
  const rect = modalElement.value.getBoundingClientRect();
  const currentX = rect.left;
  const currentY = rect.top;

  offset.x = x - currentX;
  offset.y = y - currentY;

  // Entferne Transform beim Start des Draggings
  position.value.transform = 'none';
  position.value.left = `${currentX}px`;
  position.value.top = `${currentY}px`;

  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', stopDrag);
  window.addEventListener('touchmove', onDrag, { passive: false });
  window.addEventListener('touchend', stopDrag);
}

function onDrag(e) {
  if (!isDragging.value) return;
  e.preventDefault();

  const { x, y } = getEventCoordinates(e);

  // Berechne neue Position
  const newLeft = x - offset.x;
  const newTop = y - offset.y;

  // Begrenze die Position auf den Bildschirm
  const modalRect = modalElement.value.getBoundingClientRect();
  const maxLeft = window.innerWidth - modalRect.width;
  const maxTop = window.innerHeight - modalRect.height;

  position.value.left = `${Math.max(0, Math.min(newLeft, maxLeft))}px`;
  position.value.top = `${Math.max(0, Math.min(newTop, maxTop))}px`;
}

function stopDrag() {
  isDragging.value = false;
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', stopDrag);
  window.removeEventListener('touchmove', onDrag);
  window.removeEventListener('touchend', stopDrag);
}

// Zentriere das Modal beim Öffnen
function centerModal() {
  position.value = {
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
  };
}

// Überwache das Öffnen des Modals - nur beim ersten Mal zentrieren
watch(
  () => props.show,
  (newValue) => {
    if (newValue && !hasBeenMoved.value) {
      nextTick(() => {
        centerModal();
      });
    }
  }
);
</script>

<style scoped>
/* Smooth scroll behavior */
.scrollbar-thin {
  scrollbar-width: thin;
}
.scrollbar-thin::-webkit-scrollbar {
  width: 6px;
}
.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}
.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: #4a5568;
  border-radius: 20px;
}

/* Modal Content Höhe im Landscape-Modus */
@media screen and (orientation: landscape) {
  .modal-content {
    max-height: 90vh;
  }
}

/* Für sehr kleine Bildschirme */
@media screen and (max-height: 600px) {
  .modal-content {
    max-height: 95vh;
  }
}
</style>
