import { ref } from 'vue';
import { findingApi } from "@/modules/findings/findingApi.ts";
import {projectApi} from "@/api/project.api.ts";
import { imageApi } from "@/api/images.ts";
import {useAuth} from "@/composables/useAuth.ts";
import {useToast} from "@/composables/useToast.ts";

export function useFindings() {
  const finding = ref<any>([]);
  const images = ref<any>([]);
  const userRating = ref<any>("");
  const projectUsers = ref<any>([]);

  const isLoading = ref(false);
  const { pushToast } = useToast();

  async function loadFinding(id: string, edit = false, pid = "") {
    isLoading.value = true;

    try {
      const response = id != undefined ? await findingApi.getById(id) : await findingApi.getRandom(pid);
      if (response.success) pushToast(response.success, "success");
      if (response.error) pushToast(response.error, "error");
      finding.value = response.data;
      images.value = response.data.images;
      finding.value.personalRating = response.data.userRatingId ?? "";
      userRating.value = response.data.userRatingId ?? "";

      if (edit) {
        mapSelectValues();
      }

      const project = await projectApi.getById(response.data.projectId);
      projectUsers.value = project.UserInProject.map((u: any) => u.user);
    } catch (err: any) {
      pushToast(err.message, "error");
    } finally {
      isLoading.value = false;
    }
  }

  async function loadNewFinding(projectId: string) {
    isLoading.value = true;    try {
      const response = await projectApi.getById(projectId);
      console.log(response);
      if (response.success) pushToast(response.success, "success");
      if (response.error) pushToast(response.error, "error");
      projectUsers.value = response.UserInProject.map((u: any) => u.user);

      finding.value = {
        title: "", description: "", user: [], heuristics: [], ratingId: undefined,
        project: response, projectId: response.projectId
      };
    } catch (err: any) {
      pushToast(err.message, "error");
    } finally {
      isLoading.value = false;
    }
  }

  function mapSelectValues() {
    finding.value.heuristics = finding.value.heuristics.map((h: any) => h.id);
    finding.value.user = finding.value.user.map((a: any) => a.id);
  }

  async function createFinding() {
    try {
      const payload = finding.value;
      payload.projectId = payload.project.id;
      delete payload.project;

      const response = await findingApi.create(payload);
      if (response.success) pushToast(response.success, "success");
      if (response.error) pushToast(response.error, "error");
      finding.value = response.data ?? [];

      return finding.value.id;
    } catch (err: any) {
      pushToast(err.message, "error");
      throw err;
    }
  }

  async function saveFinding() {
    try {
      const payload = finding.value;

      const response = await findingApi.save(payload);
      if (response.success) pushToast(response.success, "success");
      if (response.error) pushToast(response.error, "error");
      finding.value = response.data ?? [];
      finding.value.personalRating = response.data.userRatings[0]?.ratingId ?? "5";
      mapSelectValues();
    } catch (err: any) {
      pushToast(err.message, "error");
      throw err;
    }
  }

  async function removeFinding(id: string) {
    try {
      const response = await findingApi.remove(id);
      if (response.success) pushToast(response.success, "success");
      if (response.error) pushToast(response.error, "error");
      finding.value = response.data;
    } catch (err: any) {
      pushToast(err.message, "error");
      throw err;
    }
  }

  async function uploadImages(data: any) {
    try {
      const response = await imageApi.uploadFindingImages(finding.value.project.id, finding.value.id, data);
      if (response.success) pushToast(response.success, "success");
      if (response.error) pushToast(response.error, "error");
      images.value = response;
    } catch (err: any) {
      pushToast(err.message, "error");
      throw err;
    }
  }

  async function saveRating(next: boolean) {
    try {
      const findingId = finding.value.id;
      const rating = userRating.value;

      const ratingResponse = await findingApi.saveRating(findingId, rating);
      if (ratingResponse.success) pushToast(ratingResponse.success, "success");
      if (ratingResponse.error) pushToast(ratingResponse.error, "error");

      if (next) {
        const findingResponse = await findingApi.getRandom(finding.value.projectId);
        finding.value = findingResponse.data;
        images.value = findingResponse.data.images;
        userRating.value = findingResponse.data.userRatings ?? "";
      }
    } catch (err: any) {
      pushToast(err.message, "error");
      throw err;
    }
  }

  return {
    finding,
    images,
    userRating,
    projectUsers,
    loadFinding,
    loadNewFinding,
    createFinding,
    saveFinding,
    removeFinding,
    saveRating,
    uploadImages,
  };
}
