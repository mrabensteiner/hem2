import { ref } from 'vue';
import { findingApi } from "@/modules/findings/findingApi.ts";
import {projectApi} from "@/api/project.api.ts";

export function useFindings() {
  const finding = ref<any>([]);
  const projectUsers = ref<any>([]);

  const isLoading = ref(false);
  const success = ref<string | null>(null);
  const error = ref<string | null>(null);

  async function loadFinding(id: string, edit = false) {
    isLoading.value = true;
    error.value = null;
    success.value = null;

    try {
      const response = await findingApi.getById(id);
      success.value = response.success ?? "";
      error.value = response.error ?? "";
      finding.value = response.data;

      if (edit) {
        mapSelectValues();
      }

      const project = await projectApi.getById(response.data.projectId);
      projectUsers.value = project.UserInProject.map((u: any) => u.user);
    } catch (err: any) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  async function loadNewFinding(projectId: string) {
    isLoading.value = true;
    error.value = null;
    success.value = null;

    try {
      const response = await projectApi.getById(projectId);
      console.log(response);
      success.value = response.success ?? "";
      error.value = response.error ?? "";
      projectUsers.value = response.UserInProject.map((u: any) => u.user);

      finding.value = {
        title: "", description: "", user: [], heuristics: [], ratingId: undefined,
        project: response, projectId: response.projectId
      };
    } catch (err: any) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  function mapSelectValues() {
    finding.value.heuristics = finding.value.heuristics.map((h: any) => h.id);
    finding.value.user = finding.value.user.map((a: any) => a.id);
  }

  async function createFinding() {
    error.value = null;
    success.value = null;

    try {
      const payload = finding.value;
      payload.projectId = payload.project.id;
      delete payload.project;

      const response = await findingApi.create(payload);
      success.value = response.success ?? "";
      error.value = response.error ?? "";
      finding.value = response.data ?? [];

      return finding.value.id;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
  }

  async function saveFinding() {
    error.value = null;
    success.value = null;

    try {
      const payload = finding.value;

      const response = await findingApi.save(payload);
      success.value = response.success ?? "";
      error.value = response.error ?? "";
      finding.value = response.data ?? [];
      mapSelectValues();
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
  }

  async function removeFinding(id: string) {
    error.value = null;
    success.value = null;

    try {
      const response = await findingApi.remove(id);
      success.value = response.success ?? "";
      error.value = response.error ?? "";
      finding.value = response.data;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
  }

  return {
    finding,
    projectUsers,
    loadFinding,
    loadNewFinding,
    createFinding,
    saveFinding,
    removeFinding,
    success,
    error
  };
}
