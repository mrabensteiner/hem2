import {apiClient} from './client.ts';

const endpoint = "status";

export const statusApi = {
  async getAll() {
    return apiClient(endpoint);
  },

  async getById(id: string) {
    return apiClient(`${endpoint}/${id}`);
  },
};
