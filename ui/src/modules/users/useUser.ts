import { ref } from 'vue';
import { userApi } from "./userApi.ts";
import {useToast} from "@/composables/useToast.ts";

export function useUser() {
  const users = ref<any[]>([]);
  const user = ref<any>({});

  const isLoading = ref(false);
  const { pushToast } = useToast();

  function prepareForTable(data: any[]) {
    return data.map((user: any) => ({
      ...user,
      roleTitle: (user.role ?? {}).title ?? undefined,
      link: `/users/${user.id}`
    }));
  }

  async function loadUsers() {
    isLoading.value = true;

    try {
      const rawData = await userApi.getAll();
      users.value = prepareForTable(rawData);
    } catch (err: any) {
      pushToast(err.message, "error");
    } finally {
      isLoading.value = false;
    }
  }

  async function loadUser(id: string, isNew: boolean) {
    isLoading.value = true;

    try {
      if (!isNew) {
        const data = await userApi.getById(id);
        user.value = data;
      }
    } catch (err: any) {
      pushToast(err.message, "error");
    } finally {
      isLoading.value = false;
    }
  }

  async function saveUser(isNew: boolean) {
    try {
      const payload = user.value;

      const savedData = await userApi.save(payload, isNew);
      user.value = savedData;
      pushToast(savedData.success, "success");

      return savedData;
    } catch (err: any) {
      pushToast(err.message);
      throw err;
    }
  }

  return {
    users,
    user,
    loadUsers,
    loadUser,
    saveUser,
  };
}
