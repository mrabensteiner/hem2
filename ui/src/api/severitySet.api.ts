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
};
