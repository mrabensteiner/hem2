import { ref } from 'vue';
import { userApi } from "./userApi.ts";
import {useToast} from "@/composables/useToast.ts";
import {imageApi} from "@/api/images.ts";

export function useUser() {
  const users = ref<any[]>([]);
  const user = ref<any>({});
  const newImage = ref<File | null>(null);

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

  async function loadUser(id: string, isNew: boolean = false) {
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

      if (newImage.value) {
        const formData = new FormData();
        formData.append("image", newImage.value);
        await uploadImage(formData);
      }

      pushToast(savedData.success, "success");

      return savedData;
    } catch (err: any) {
      pushToast(err.message);
      throw err;
    }
  }

  async function uploadImage(data: any) {
    try {
      const response = await imageApi.uploadUserImage(user.value.id, data);
      if (response.success) pushToast(response.success, "success");
      if (response.error) pushToast(response.error, "error");
      user.value.logo = response;
    } catch (err: any) {
      pushToast(err.message, "error");
      throw err;
    }
  }

  return {
    users,
    user,
    newImage,
    loadUsers,
    loadUser,
    saveUser,
  };
}
