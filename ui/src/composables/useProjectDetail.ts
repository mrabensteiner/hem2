import { ref } from 'vue';
import { projectApi } from '../api/project.api.js';
import {heuristicSetApi} from "@/api/heuristicSet.api.ts";
import {ratingSetApi} from "@/api/ratingSetApi.ts";
import {statusApi} from "@/modules/statuses/statusApi.ts";
import {userApi} from "@/api/user.api.ts";

export function useProjectDetail() {
  const project = ref<any>({ title: '', description: '', statusId: '', heuristicsetId: '', ratingsetId: '' });
  const findings = ref<any[]>([]);
  const managers = ref<string[]>([]);
  const members = ref<string[]>([]);

  const isLoading = ref(false);
  const error = ref<string | null>(null);

  const statuses = ref<any>([]);
  const heuristics = ref<any>([]);
  const ratings = ref<any>([]);
  const users = ref<any[]>([]);

  function extractRoles(userInProjectList: any[]) {
    managers.value = [];
    members.value = [];

    userInProjectList?.forEach((item) => {
      if (item.projectRole === 'MANAGER') {
        managers.value.push(item.userId);
      } else if (item.projectRole === 'MEMBER') {
        members.value.push(item.userId);
      }
    });
  }

  function prepareFindingsForTable(projectData: any) {
    if (!projectData.Findings) {
      findings.value = [];
      return;
    }

    findings.value = projectData.Findings.map((finding: any) => ({
      ...finding,
      user: finding.user ? finding.user.map((u: any) => `${u.firstname} ${u.lastname}`) : [],
      link: `/project/${projectData.id}/findings/${finding.id}`
    }));
  }

  async function loadProject(projectId: string, isNew: boolean = false) {
    isLoading.value = true;
    error.value = null;

    try {
      [statuses.value, heuristics.value, ratings.value, users.value] = await Promise.all([
        statusApi.getAll(),
        heuristicSetApi.getAll(),
        ratingSetApi.getAll(),
        userApi.getAll()
      ]);

      [statuses].map(set => {
        set.value = set.value.data;
      });

      if (!isNew) {
        const data = await projectApi.getById(projectId);
        project.value = data;

        extractRoles(data.UserInProject);
        prepareFindingsForTable(data);
      }
    } catch (err: any) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  async function saveProject(isNew: boolean) {
    error.value = null;

    try {
      const payload = {
        ...project.value,
        managers: managers.value,
        members: members.value
      };

      const savedData = await projectApi.save(payload, isNew);
      project.value = savedData;

      return savedData;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
  }

  return {
    project,
    findings,
    managers,
    members,
    statuses,
    heuristics,
    ratings,
    users,
    isLoading,
    error,
    loadProject,
    saveProject
  };
}
