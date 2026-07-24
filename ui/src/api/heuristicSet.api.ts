import {apiClient} from './client.ts';

const endpoint = "heuristic-sets";

export const heuristicSetApi = {
  async getAll() {
    return apiClient(endpoint);
  },

  async getById(id: string) {
    return apiClient(`${endpoint}/${id}`);
  },
};
