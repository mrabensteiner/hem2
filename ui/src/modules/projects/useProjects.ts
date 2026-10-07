import { ref } from 'vue';
import { projectApi } from '@/api/project.api.ts';
import {heuristicSetApi} from "@/modules/heuristics/heuristicSetApi.ts";
import {ratingSetApi} from "@/modules/ratings/ratingSetApi.ts";
import {statusApi} from "@/modules/statuses/statusApi.ts";
import {userApi} from "@/api/user.api.ts";
import {imageApi} from "@/api/images.ts";
import {useToast} from "@/composables/useToast.ts";
import {useAuth} from "@/composables/useAuth.ts";

const {hasPrivilege} = useAuth();

const project = ref<any>({ title: '', description: '', statusId: '', heuristicsetId: '', ratingsetId: '' });

export function useProjects() {
  const projects = ref<any[]>([]);
  const findings = ref<any[]>([]);
  const managers = ref<string[]>([]);
  const members = ref<string[]>([]);
  const newLogo = ref<File | null>(null);

  const isLoading = ref(false);
  const { pushToast } = useToast();

  const statuses = ref<any>([]);
  const heuristicSets = ref<any>([]);
  const ratingSets = ref<any>([]);
  const users = ref<any[]>([]);

  function prepareProjectsForTable(data: any[]) {
    return data.map((project: any) => ({
      ...project,
      deactivated: !project.status.projectViewDetails && !hasPrivilege.value("projectViewAll"),
      link: `/project/${project.id}`,
      manager: project.UserInProject
        ? project.UserInProject.filter((uip: any) => uip.projectRole === "MANAGER").map((uip: any) => `${uip.user.firstname} ${uip.user.lastname}`)
        : []
    }));
  }

  async function loadProjects() {
    isLoading.value = true;
    try {
      const rawData = await projectApi.getAll();
      projects.value = prepareProjectsForTable(rawData);
    } catch (err: any) {
      pushToast(err.message, "error");
    } finally {
      isLoading.value = false;
    }
  }

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
        if (data.success) pushToast(data.success, "success");
        project.value = data;

        extractRoles(data.UserInProject);
        prepareFindingsForTable(data);
        return data;
      }
    } catch (err: any) {
      pushToast(err.message, "error");
    } finally {
      isLoading.value = false;
    }
  }

  function setProject(value: any) {
    project.value = value;
  }

  async function saveProject(isNew: boolean = false) {
    try {
      const payload = {
        ...project.value,
        managers: managers.value,
        members: members.value
      };

      const savedData = await projectApi.save(payload, isNew);
      project.value = savedData;

      if (newLogo.value) {
        const formData = new FormData();
        formData.append("image", newLogo.value);
        await uploadImage(formData);
      }

      pushToast(savedData.success, "success");

      return savedData;
    } catch (err: any) {
      pushToast(err.message, "error");
      throw err;
    }
  }

  async function updateStatus(id: string) {
    try {
      const payload = {
        id: project.value.id,
        statusId: id
      };

      const savedData = await projectApi.updateStatus(payload);
      project.value = savedData;
      pushToast(savedData.success, "success");

      return savedData;
    } catch (err: any) {
      pushToast(err.message, "error");
      throw err;
    }
  }

  async function prevStatus() {
    updateStatus(project.value.status.prev.id);
  }

  async function nextStatus() {
    updateStatus(project.value.status.next.id);
  }

  function checkProjectPrivilege(privilege: string) {
    const status = project.value.status;
    // TODO
    // managers.value.includes(userId)
    // members.value.includes(userId) && status[privilege]
  }

  async function uploadImage(data: any) {
    try {
      const response = await imageApi.uploadProjectImage(project.value.id, data);
      if (response.success) pushToast(response.success, "success");
      if (response.error) pushToast(response.error, "error");
      project.value.logo = response;
    } catch (err: any) {
      pushToast(err.message, "error");
      throw err;
    }
  }

  function useCalculatedRating(finding: any) {
    const calculated = finding.totalRating;
    const rounded = Math.round(calculated);
    const rating = project.value.ratingset.ratings.find((r: any) => r.order == rounded);

    if (rating) {
      finding.rating = rating;
      finding.ratingId = rating.id ?? undefined;
    }
  }

  async function exportJson() {
    const blob = await projectApi.exportJson(project.value.id);

    const filename = "project.json";

    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', filename);
    document.body.appendChild(link);

    link.click();
    link.remove();

    window.URL.revokeObjectURL(downloadUrl);
  }

  async function exportReportLatex() {
    const blob = await projectApi.exportReportLatex(project.value.id);

    const filename = "project.tex";

    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.setAttribute('download', filename);
    document.body.appendChild(link);

    link.click();
    link.remove();

    window.URL.revokeObjectURL(downloadUrl);
  }

  return {
    projects,
    project,
    findings,
    managers,
    members,
    newLogo,
    statuses,
    heuristicSets,
    ratingSets,
    users,
    isLoading,
    prepareRatingsForTable,
    loadProjects,
    loadProject,
    setProject,
    saveProject,
    prevStatus,
    nextStatus,
    uploadImage,
    checkProjectPrivilege,
    useCalculatedRating,
    exportJson,
    exportReportLatex
  };
}
