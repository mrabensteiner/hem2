import { apiClient, Method } from '@/api/client.ts';

const endpoint = "findings";

export const findingApi = {
  async getAll(pid: string) {
    return apiClient(`${endpoint}/all/${pid}`);
  },

  async getById(id: string) {
    return apiClient(`${endpoint}/${id}`);
  },

  async getRandom(pid: string) {
    return apiClient(`${endpoint}/random/${pid}`);
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

  async saveAll(pid: string, data: any) {
    return apiClient(`${endpoint}/all/${pid}`, Method.PUT, {
      body: data
    });
  },

  async remove(id: string) {
    return apiClient(endpoint, Method.DELETE, {
      body: { id: id }
    });
  },

  async saveRating(id: string, rating: string) {
    return apiClient(`${endpoint}/${id}/rate`, Method.POST, {
      body: { id: rating }
    });
  },
};
