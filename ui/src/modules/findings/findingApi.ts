import { apiClient, Method } from '@/api/client.ts';

const endpoint = "findings";

export const findingApi = {
  async getAll() {
    return apiClient(endpoint);
  },

  async getById(id: string) {
    return apiClient(`${endpoint}/${id}`);
  },

  async create(data: any) {
    return apiClient(endpoint, Method.POST, {
      body: data
    });
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
