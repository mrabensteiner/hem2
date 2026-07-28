import {apiClient, Method} from './client.ts';

const endpoint = "projects";

export const projectApi = {
  async getAll() {
    return apiClient(endpoint);
  },

  async getById(id: string) {
    return apiClient(`${endpoint}/${id}`);
  },

  async save(projectData: any, isNew: boolean) {
    return apiClient(endpoint, isNew ? Method.POST : Method.PUT, {
      body: projectData
    });
  },
};
