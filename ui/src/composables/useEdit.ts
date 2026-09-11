import {onMounted, onUnmounted, ref} from 'vue';
import {onBeforeRouteLeave} from "vue-router";

const edited = ref(false);
const confirmText = 'This page is asking you to confirm that you want to leave — information you’ve entered may not be saved.';

const handleBeforeUnload = (event: BeforeUnloadEvent) => {
  if (edited.value) {
    event.preventDefault();
  }
}

export function useEdit() {
  onMounted(() => {
    window.addEventListener('beforeunload', handleBeforeUnload)
  });

  onUnmounted(() => {
    window.removeEventListener('beforeunload', handleBeforeUnload);
  });

  onBeforeRouteLeave(() => {
    if (edited.value) {
      const answer = window.confirm(confirmText);
      if (!answer) {
        return false;
      }
      edited.value = false;
    }
  });

  return { edited };
}
