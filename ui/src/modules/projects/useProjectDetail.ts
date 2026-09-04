import { ref } from 'vue';
import { projectApi } from '@/api/project.api.ts';
import {heuristicSetApi} from "@/modules/heuristics/heuristicSetApi.ts";
import {ratingSetApi} from "@/modules/ratings/ratingSetApi.ts";
import {statusApi} from "@/modules/statuses/statusApi.ts";
import {userApi} from "@/api/user.api.ts";
import {imageApi} from "@/api/images.ts";

export function useProjectDetail() {
  const project = ref<any>({ title: '', description: '', statusId: '', heuristicsetId: '', ratingsetId: '' });
  const findings = ref<any[]>([]);
  const managers = ref<string[]>([]);
  const members = ref<string[]>([]);

  const isLoading = ref(false);
  const success = ref<string | null>(null);
  const error = ref<string | null>(null);

  const statuses = ref<any>([]);
  const heuristicSets = ref<any>([]);
  const ratingSets = ref<any>([]);
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

  function prepareRatingsForTable() {
    findings.value = [];

    if (!project.value.Findings) {
      return;
    }

    const ratingSet = project.value.ratingset.ratings;

    project.value.Findings.forEach((f: any) => {
      const ur = f.userRatings;

      f.rpu = members.value.map((uid) => {
        const ratingId = ur.find((r: any) => r.userId === uid && r.findingId === f.id)?.ratingId;
        const rating = ratingSet.find((r: any) => r.id === ratingId);

        return {
          userId: uid,
          title: rating?.title ?? "",
          value: rating?.order ?? "-"
        };
      })

      let total = f.rpu.map((r: any) => r.value);
      total = total.filter((i: string | number) => i != "-");
      total = total.length ? total.reduce((a: number, b: number) => a + b) / total.length : "-";
      f.totalRating = total;

      findings.value.push(f);
    })
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
    success.value = null;

    try {
      [statuses.value, heuristicSets.value, ratingSets.value, users.value] = await Promise.all([
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
        success.value = data.success;
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

  async function saveProject(isNew: boolean = false) {
    error.value = null;
    success.value = null;

    try {
      const payload = {
        ...project.value,
        managers: managers.value,
        members: members.value
      };

      const savedData = await projectApi.save(payload, isNew);
      project.value = savedData;
      success.value = savedData.success;

      return savedData;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
  }

  function checkProjectPrivilege(privilege: string) {
    const status = project.value.status;
    // TODO
    // managers.value.includes(userId)
    // members.value.includes(userId) && status[privilege]
  }

  async function uploadImage(data: any) {
    error.value = null;
    success.value = null;

    try {
      const response = await imageApi.uploadProjectImage(project.value.id, data);
      success.value = response.success ?? "";
      error.value = response.error ?? "";
      project.value.logo = response;
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
    heuristicSets,
    ratingSets,
    users,
    isLoading,
    prepareRatingsForTable,
    success,
    error,
    loadProject,
    saveProject,
    uploadImage,
    checkProjectPrivilege
  };
}
