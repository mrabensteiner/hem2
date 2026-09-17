import { ref } from 'vue';
import { ratingSetApi } from "@/modules/ratings/ratingSetApi.ts";
import {useToast} from "@/composables/useToast.ts";

export function useRating() {
  const ratingSets = ref<any[]>([]);
  const ratingSet = ref<any>({ title: '', description: '' });
  const rating = ref<any>([]);

  const isLoading = ref(false);
  const { pushToast } = useToast();

  function prepareForTable(data: any[]) {
    return data.map((ratingSet: any) => ({
      ...ratingSet,
      link: `/ratings/${ratingSet.id}`
    }));
  }

  async function loadRatingSets() {
    isLoading.value = true;

    try {
      const rawData = await ratingSetApi.getAll();
      ratingSets.value = prepareForTable(rawData);
    } catch (err: any) {
      pushToast(err.message, "error");
    } finally {
      isLoading.value = false;
    }
  }

  async function loadRatingSet(ratingSetId: string, isNew: boolean) {
    isLoading.value = true;

    try {
      if (!isNew) {
        const data = await ratingSetApi.getById(ratingSetId);
        ratingSet.value = data;
        rating.value = data.rating;
      }
    } catch (err: any) {
      pushToast(err.message, "error");
    } finally {
      isLoading.value = false;
    }
  }

  async function saveRatingSet(isNew: boolean) {
    try {
      const payload = ratingSet.value;

      const savedData = await ratingSetApi.save(payload, isNew);
      ratingSet.value = savedData;
      pushToast(savedData.success, "success");

      return savedData;
    } catch (err: any) {
      pushToast(err.message, "error");
      throw err;
    }
  }

  async function addRating() {
    try {
      const payload = ratingSet.value;
      const newData = await ratingSetApi.createSingle(payload.id);
      await ratingSet.value.ratings.push(newData);
    } catch (err: any) {
      pushToast(err.message, "error");
      throw err;
    }
    window.scrollTo(0, document.body.scrollHeight);
  }

  async function removeRating(id: string) {
    try {
      const setId = ratingSet.value.id;
      const updatedData = await ratingSetApi.removeSingle(setId, id);
      ratingSet.value = updatedData;
      pushToast(updatedData.success, "success");

      return updatedData;
    } catch (err: any) {
      pushToast(err.message, "error");
      throw err;
    }
  }

  return {
    ratingSets,
    ratingSet,
    rating,
    loadRatingSet,
    loadRatingSets,
    saveRatingSet,
    addRating,
    removeRating,
  };
}
