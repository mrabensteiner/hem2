import { ref } from 'vue';
import { severitySetApi } from '@/api/severitySet.api.js';

export function useSeverityList() {
  const severitySets = ref<any[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

  function prepareForTable(data: any[]) {
    return data.map((severitySet: any) => ({
      ...severitySet,
      link: `/severities/${severitySet.id}`
    }));
  }

  async function loadSeveritySets() {
    isLoading.value = true;
    error.value = null;
    try {
      const rawData = await severitySetApi.getAll();
      severitySets.value = prepareForTable(rawData);
    } catch (err: any) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    severitySets,
    isLoading,
    error,
    loadSeveritySets
  };
}
