import { ref } from 'vue';
import { userApi } from "./userApi.ts";

export function useUser() {
  const users = ref<any[]>([]);
  const user = ref<any>({});

  const isLoading = ref(false);
  const success = ref<string | null>(null);
  const error = ref<string | null>(null);

  function prepareForTable(data: any[]) {
    return data.map((user: any) => ({
      ...user,
      roleTitle: (user.role ?? {}).title ?? undefined,
      link: `/users/${user.id}`
    }));
  }

  async function loadUsers() {
    isLoading.value = true;
    error.value = null;
    try {
      const rawData = await userApi.getAll();
      users.value = prepareForTable(rawData);
    } catch (err: any) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  async function loadUser(id: string, isNew: boolean) {
    isLoading.value = true;
    error.value = null;

    try {
      if (!isNew) {
        const data = await userApi.getById(id);
        user.value = data;
      }
    } catch (err: any) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  async function saveUser(isNew: boolean) {
    error.value = null;
    success.value = null;

    try {
      const payload = user.value;

      const savedData = await userApi.save(payload, isNew);
      user.value = savedData;
      success.value = savedData.success;

      return savedData;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
  }

  return {
    users,
    user,
    loadUsers,
    loadUser,
    saveUser,
    success,
    error
  };
}
