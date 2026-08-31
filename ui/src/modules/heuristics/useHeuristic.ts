import { ref } from 'vue';
import { heuristicSetApi } from "@/modules/heuristics/heuristicSetApi.ts";

export function useHeuristic() {
  const heuristicSets = ref<any[]>([]);
  const heuristicSet = ref<any>({ title: '', description: '' });
  const heuristic = ref<any>([]);

  const isLoading = ref(false);
  const success = ref<string | null>(null);
  const error = ref<string | null>(null);

  function prepareForTable(data: any[]) {
    return data.map((heuristicSet: any) => ({
      ...heuristicSet,
      link: `/heuristics/${heuristicSet.id}`
    }));
  }

  async function loadHeuristicSets() {
    isLoading.value = true;
    error.value = null;
    try {
      const rawData = await heuristicSetApi.getAll();
      heuristicSets.value = prepareForTable(rawData);
    } catch (err: any) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  async function loadHeuristicSet(heuristicSetId: string, isNew: boolean) {
    isLoading.value = true;
    error.value = null;

    try {
      if (!isNew) {
        const data = await heuristicSetApi.getById(heuristicSetId);
        heuristicSet.value = data;
        heuristic.value = data.heuristic;
      }
    } catch (err: any) {
      error.value = err.message;
    } finally {
      isLoading.value = false;
    }
  }

  async function saveHeuristicSet(isNew: boolean) {
    error.value = null;
    success.value = null;

    try {
      const payload = heuristicSet.value;

      const savedData = await heuristicSetApi.save(payload, isNew);
      heuristicSet.value = savedData;
      success.value = savedData.success;

      return savedData;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
  }

  async function addHeuristic() {
    error.value = null;
    success.value = null;

    try {
      const payload = heuristicSet.value;
      const newData = await heuristicSetApi.createSingle(payload.id);
      await heuristicSet.value.heuristics.push(newData);
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
    window.scrollTo(0, document.body.scrollHeight);
  }

  async function removeHeuristic(id: string) {
    error.value = null;
    success.value = null;

    try {
      const setId = heuristicSet.value.id;
      const updatedData = await heuristicSetApi.removeSingle(setId, id);
      heuristicSet.value = updatedData;
      success.value = updatedData.success;

      return updatedData;
    } catch (err: any) {
      error.value = err.message;
      throw err;
    }
  }

  return {
    heuristicSets,
    heuristicSet,
    heuristic,
    loadHeuristicSet,
    loadHeuristicSets,
    saveHeuristicSet,
    addHeuristic,
    removeHeuristic,
    success,
    error
  };
}
