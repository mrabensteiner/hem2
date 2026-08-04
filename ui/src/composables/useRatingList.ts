import { ref } from 'vue';
import { ratingSetApi } from '@/api/ratingSetApi.ts';

export function useRatingList() {
  const ratingSets = ref<any[]>([]);
  const isLoading = ref(false);
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

  return {
    ratingSets,
    isLoading,
    error,
    loadRatingSets
  };
}
