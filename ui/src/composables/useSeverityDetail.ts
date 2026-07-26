import { ref } from 'vue';
import { severitySetApi } from "@/api/severitySet.api.ts";

export function useSeverityDetail() {
  const severitySet = ref<any>({ title: '', description: '' });
  const severities = ref<any>([]);

  const isLoading = ref(false);
  const error = ref<string | null>(null);

  async function loadSeveritySet(severitySetId: string, isNew: boolean) {
    isLoading.value = true;
    error.value = null;

    try {
      if (!isNew) {
        const data = await severitySetApi.getById(severitySetId);
        severitySet.value = data;
        severities.value = data.severities;
      }
    } catch (err: any) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  async function saveSeveritySet(isNew: boolean) {
    error.value = null;

    try {
      const payload = severitySet.value;

      const savedData = await severitySetApi.save(payload, isNew);
      severitySet.value = savedData;

      return savedData;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
  }

  async function addSeverity() {}

  async function removeSeverity() {}

  return {
    severitySet,
    severities,
    loadSeveritySet,
    saveSeveritySet,
    addSeverity,
    removeSeverity,
  };
}
