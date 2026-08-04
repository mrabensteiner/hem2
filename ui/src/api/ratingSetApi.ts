import {apiClient, Method} from './client.ts';

const endpoint = "ratingsets";

export const ratingSetApi = {
  async getAll() {
    return apiClient(endpoint);
  },

  async getById(id: string) {
    return apiClient(`${endpoint}/${id}`);
  },

  async save(ratingData: any, isNew: boolean) {
    return apiClient(endpoint, isNew ? Method.POST : Method.PUT, {
      body: ratingData
    });
  },

  async remove(id: string) {
    return apiClient(`${endpoint}/${id}`, Method.DELETE, {
      body: { id: id }
    });
  },

  async createSingle(id: string) {
    return apiClient(`${endpoint}/${encodeURI(id)}`, Method.POST);
  },

  async removeSingle(setId: string, id: string) {
    return apiClient(`${endpoint}/${setId}`, Method.DELETE, {
      body: { id: id }
    });
  },
};
