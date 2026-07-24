import {apiClient} from './client.ts';

const endpoint = "severities";

export const severitySetApi = {
  async getAll() {
    return apiClient(endpoint);
  },

  async getById(id: string) {
    return apiClient(`${endpoint}/${id}`);
  },
};
