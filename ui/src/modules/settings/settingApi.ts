import { apiClient, Method } from '@/api/client.ts';

const endpoint = "settings";

export const settingApi = {
  async getAll() {
    return apiClient(endpoint);
  },

  async create() {
    return apiClient(endpoint, Method.POST);
  },

  async save(data: any) {
    return apiClient(endpoint, Method.PUT, {
      body: data
    });
  },

  async remove(id: string) {
  return apiClient(endpoint, Method.DELETE, {
    body: { id: id }
  });
},
};
