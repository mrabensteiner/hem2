import {reactive} from 'vue';

const toasts = reactive<any>([]);
let counter = 0;

export function useToast() {
  function pushToast(message: string, type = 'info') {
    const toast = {message, type, id: counter++}
    toasts.push(toast);

    setTimeout(() => {
      toasts.splice(0, 1);
    }, 5000)
  }

  return { toasts, pushToast };
}
