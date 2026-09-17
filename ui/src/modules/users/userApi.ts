import {apiClient, Method} from '@/api/client.ts';

const endpoint = "users";

export const userApi = {
  async getAll() {
    return apiClient(endpoint);
  },

  async getById(id: string) {
    return apiClient(`${endpoint}/${id}`);
  },

  async save(user: any, isNew: boolean) {
    return apiClient(endpoint, isNew ? Method.POST : Method.PUT, {
      body: user
    });
  },

  async remove(id: string) {
    return apiClient(`${endpoint}/${id}`, Method.DELETE, {
      body: { id: id }
    });
  },
};
