import { ref } from 'vue';
import { statusApi } from "@/modules/statuses/statusApi.ts";
import {useToast} from "@/composables/useToast.ts";

export function useStatuses() {
  const statuses = ref<any>([]);

  const isLoading = ref(false);
  const { pushToast } = useToast();

  async function loadStatuses() {
    isLoading.value = true;

    try {
      const response = await statusApi.getAll();
      if (response.success) pushToast(response.success, "success");
      if (response.error) pushToast(response.error, "error");
      statuses.value = response.data;
    } catch (err: any) {
      pushToast(err.message, "error");
    } finally {
      isLoading.value = false;
    }
  }

  async function saveStatuses() {
    try {
      const payload = statuses.value;

      const response = await statusApi.save(payload);
      if (response.success) pushToast(response.success, "success");
      if (response.error) pushToast(response.error, "error");
      statuses.value = response.data ?? [];
    } catch (err: any) {
      pushToast(err.message, "error");
      throw err;
    }
  }

  async function addStatus() {
    try {
      const response = await statusApi.create();
      if (response.success) pushToast(response.success, "success");
      if (response.error) pushToast(response.error, "error");
      statuses.value.push(response.data);
    } catch (err: any) {
      pushToast(err.message, "error");
      throw err;
    }
  }

  async function removeStatus(id: string) {
    try {
      const response = await statusApi.remove(id);
      if (response.success) pushToast(response.success, "success");
      if (response.error) pushToast(response.error, "error");
      statuses.value = response.data;
    } catch (err: any) {
      pushToast(err.message, "error");
      throw err;
    }
  }

  return {
    statuses,
    loadStatuses,
    saveStatuses,
    addStatus,
    removeStatus,
  };
}
