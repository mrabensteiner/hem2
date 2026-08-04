import { ref } from 'vue';
import { statusApi } from "@/modules/statuses/statusApi.ts";

export function useStatuses() {
  const statuses = ref<any>([]);

  const isLoading = ref(false);
  const success = ref<string | null>(null);
  const error = ref<string | null>(null);

  async function loadStatuses() {
    isLoading.value = true;
    error.value = null;
    success.value = null;

    try {
      const response = await statusApi.getAll();
      success.value = response.success ?? "";
      error.value = response.error ?? "";
      statuses.value = response.data;
    } catch (err: any) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  async function saveStatuses() {
    error.value = null;
    success.value = null;

    try {
      const payload = statuses.value;

      const response = await statusApi.save(payload);
      success.value = response.success ?? "";
      error.value = response.error ?? "";
      statuses.value = response.data ?? [];
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
  }

  async function addStatus() {
    error.value = null;
    success.value = null;

    try {
      const response = await statusApi.create();
      success.value = response.success ?? "";
      error.value = response.error ?? "";
      statuses.value.push(response.data);
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
  }

  async function removeStatus(id: string) {
    error.value = null;
    success.value = null;

    try {
      const response = await statusApi.remove(id);
      success.value = response.success ?? "";
      error.value = response.error ?? "";
      statuses.value = response.data;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
  }

  return {
    statuses,
    loadStatuses,
    saveStatuses,
    addStatus,
    removeStatus,
    success,
    error
  };
}
