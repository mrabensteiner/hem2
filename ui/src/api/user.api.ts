import {apiClient} from './client.ts';

const endpoint = "users";

export const userApi = {
  async getAll() {
    return apiClient(endpoint);
  },

  async getById(id: string) {
    return apiClient(`${endpoint}/${id}`);
  },
};
