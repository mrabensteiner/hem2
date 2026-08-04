import { ref } from 'vue';
import { roleApi } from "@/modules/roles/roleApi.ts";

export function useRoles() {
  const roles = ref<any>([]);

  const isLoading = ref(false);
  const success = ref<string | null>(null);
  const error = ref<string | null>(null);

  async function loadRoles() {
    isLoading.value = true;
    error.value = null;
    success.value = null;

    try {
      const response = await roleApi.getAll();
      success.value = response.success ?? "";
      error.value = response.error ?? "";
      roles.value = response.data;
    } catch (err: any) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  async function saveRoles() {
    error.value = null;
    success.value = null;

    try {
      const payload = roles.value;

      const response = await roleApi.save(payload);
      success.value = response.success ?? "";
      error.value = response.error ?? "";
      roles.value = response.data ?? [];
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
  }

  async function addRole() {
    error.value = null;
    success.value = null;

    try {
      const response = await roleApi.create();
      success.value = response.success ?? "";
      error.value = response.error ?? "";
      roles.value.push(response.data);
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
  }

  async function removeRole(id: string) {
    error.value = null;
    success.value = null;

    try {
      const response = await roleApi.remove(id);
      success.value = response.success ?? "";
      error.value = response.error ?? "";
      roles.value = response.data;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
  }

  return {
    roles,
    loadRoles,
    saveRoles,
    addRole,
    removeRole,
    success,
    error
  };
}
