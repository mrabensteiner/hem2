import { ref } from 'vue';
import { ratingSetApi } from "@/modules/ratings/ratingSetApi.ts";

export function useRating() {
  const ratingSets = ref<any[]>([]);
  const ratingSet = ref<any>({ title: '', description: '' });
  const rating = ref<any>([]);

  const isLoading = ref(false);
  const success = ref<string | null>(null);
  const error = ref<string | null>(null);

  function prepareForTable(data: any[]) {
    return data.map((ratingSet: any) => ({
      ...ratingSet,
      link: `/ratings/${ratingSet.id}`
    }));
  }

  async function loadRatingSets() {
    isLoading.value = true;
    error.value = null;
    try {
      const rawData = await ratingSetApi.getAll();
      ratingSets.value = prepareForTable(rawData);
    } catch (err: any) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  async function loadRatingSet(ratingSetId: string, isNew: boolean) {
    isLoading.value = true;
    error.value = null;

    try {
      if (!isNew) {
        const data = await ratingSetApi.getById(ratingSetId);
        ratingSet.value = data;
        rating.value = data.rating;
      }
    } catch (err: any) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  async function saveRatingSet(isNew: boolean) {
    error.value = null;
    success.value = null;

    try {
      const payload = ratingSet.value;

      const savedData = await ratingSetApi.save(payload, isNew);
      ratingSet.value = savedData;
      success.value = savedData.success;

      return savedData;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
  }

  async function addRating() {
    error.value = null;
    success.value = null;

    try {
      const payload = ratingSet.value;
      const newData = await ratingSetApi.createSingle(payload.id);
      await ratingSet.value.ratings.push(newData);
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
    window.scrollTo(0, document.body.scrollHeight);
  }

  async function removeRating(id: string) {
    error.value = null;
    success.value = null;

    try {
      const setId = ratingSet.value.id;
      const updatedData = await ratingSetApi.removeSingle(setId, id);
      ratingSet.value = updatedData;
      success.value = updatedData.success;

      return updatedData;
    } catch (err: any) {
      error.value = err.message;
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
    success,
    error
  };
}
