import { ref } from 'vue';
import { projectApi } from '@/api/project.api.ts';
import {useAuth} from "@/composables/useAuth.ts";

const {hasPrivilege} = useAuth();

export function useProjectsList() {
  const projects = ref<any[]>([]);
  const isLoading = ref(false);
  const error = ref<string | null>(null);

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
    error.value = null;
    try {
      const rawData = await projectApi.getAll();
      projects.value = prepareForTable(rawData);
    } catch (err: any) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  return {
    projects,
    isLoading,
    error,
    loadProjects
  };
}
