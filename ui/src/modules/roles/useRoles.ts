import { ref } from 'vue';
import { roleApi } from "@/modules/roles/roleApi.ts";
import {useToast} from "@/composables/useToast.ts";

export function useRoles() {
  const roles = ref<any>([]);

  const isLoading = ref(false);
  const { pushToast } = useToast();

  async function loadRoles() {
    isLoading.value = true;

    try {
      const response = await roleApi.getAll();
      if (response.success) pushToast(response.success, "success");
      if (response.error) pushToast(response.error, "error");
      roles.value = response.data;
    } catch (err: any) {
      pushToast(err.message, "error");
    } finally {
      isLoading.value = false;
    }
  }

  async function saveRoles() {
    try {
      const payload = roles.value;

      const response = await roleApi.save(payload);
      if (response.success) pushToast(response.success, "success");
      if (response.error) pushToast(response.error, "error");
      roles.value = response.data ?? [];
    } catch (err: any) {
      pushToast(err.message, "error");
      throw err;
    }
  }

  async function addRole() {
    try {
      const response = await roleApi.create();
      if (response.success) pushToast(response.success, "success");
      if (response.error) pushToast(response.error, "error");
      roles.value.push(response.data);
    } catch (err: any) {
      pushToast(err.message, "error");
      throw err;
    }
  }

  async function removeRole(id: string) {
    try {
      const response = await roleApi.remove(id);
      if (response.success) pushToast(response.success, "success");
      if (response.error) pushToast(response.error, "error");
      roles.value = response.data;
    } catch (err: any) {
      pushToast(err.message, "error");
      throw err;
    }
  }

  return {
    roles,
    loadRoles,
    saveRoles,
    addRole,
    removeRole,
  };
}
