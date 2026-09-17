import { ref } from 'vue';
import { projectApi } from '@/api/project.api.ts';
import {useAuth} from "@/composables/useAuth.ts";
import {useToast} from "@/composables/useToast.ts";

const {hasPrivilege} = useAuth();

export function useProjectsList() {
  const projects = ref<any[]>([]);
  const isLoading = ref(false);

  const { pushToast } = useToast();

  function prepareForTable(data: any[]) {
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
      projects.value = prepareForTable(rawData);
    } catch (err: any) {
      pushToast(err.message, "error");
    } finally {
      isLoading.value = false;
    }
  }

  return {
    projects,
    isLoading,
    loadProjects
  };
}
