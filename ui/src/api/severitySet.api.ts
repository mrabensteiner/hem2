import {apiClient, Method} from './client.ts';

const endpoint = "severities";

export const severitySetApi = {
  async getAll() {
    return apiClient(endpoint);
  },

  async getById(id: string) {
    return apiClient(`${endpoint}/${id}`);
  },

  async save(severityData: any, isNew: boolean) {
    return apiClient(endpoint, isNew ? Method.POST : Method.PUT, {
      body: severityData
    });
  },

  async remove(id: string) {
    return apiClient(`${endpoint}/${id}`, Method.DELETE, {
      body: { id: id }
    });
  },

  async createSingle(id: string) {
    console.log("creasingel")
    console.log(`${endpoint}/${id}`, Method.POST);
    return apiClient(`${endpoint}/${encodeURI(id)}`, Method.POST);
  },

  async removeSingle(setId: string, id: string) {
    return apiClient(`${endpoint}/${setId}`, Method.DELETE, {
      body: { id: id }
    });
  },
};
