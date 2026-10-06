import { apiClient, Method } from '@/api/client.ts';

const endpoint = "images";

export const imageApi = {
  async uploadUserImage(userId: string, data: any) {
    return apiClient(`${endpoint}/user/${userId}`, Method.POST, {
      body: data
    });
  },

  async uploadProjectImage(projectId: string, data: any) {
    return apiClient(`${endpoint}/project/${projectId}`, Method.POST, {
      body: data
    });
  },

  async uploadFindingImages(projectId: string, findingId: string, data: any) {
    return apiClient(`${endpoint}/finding/${projectId}/${findingId}`, Method.POST, {
      body: data
    });
  },
};
