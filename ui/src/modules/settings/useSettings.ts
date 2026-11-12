import { ref } from 'vue';
import { settingApi } from "@/modules/settings/settingApi.ts";
import {useToast} from "@/composables/useToast.ts";

export function useSettings() {
  const settings = ref<any>([]);

  const isLoading = ref(false);
  const { pushToast } = useToast();

  async function loadSettings() {
    isLoading.value = true;

    try {
      const response = await settingApi.getAll();
      if (response.success) pushToast(response.success, "success");
      if (response.error) pushToast(response.error, "error");
      settings.value = response.data;
    } catch (err: any) {
      pushToast(err.message, "error");
    } finally {
      isLoading.value = false;
    }
  }

  async function saveSettings() {
    try {
      const payload = settings.value;

      const response = await settingApi.save(payload);
      if (response.success) pushToast(response.success, "success");
      if (response.error) pushToast(response.error, "error");
      settings.value = response.data ?? [];
    } catch (err: any) {
      pushToast(err.message, "error");
      throw err;
    }
  }

  async function addSetting() {
    try {
      const response = await settingApi.create();
      if (response.success) pushToast(response.success, "success");
      if (response.error) pushToast(response.error, "error");
      settings.value.push(response.data);
    } catch (err: any) {
      pushToast(err.message, "error");
      throw err;
    }
  }

  async function removeSetting(id: string) {
    try {
      const response = await settingApi.remove(id);
      if (response.success) pushToast(response.success, "success");
      if (response.error) pushToast(response.error, "error");
      settings.value = response.data;
    } catch (err: any) {
      pushToast(err.message, "error");
      throw err;
    }
  }

  return {
    settings,
    loadSettings,
    saveSettings,
    addSetting,
    removeSetting,
  };
}
