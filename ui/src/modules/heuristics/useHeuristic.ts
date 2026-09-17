import { ref } from 'vue';
import { heuristicSetApi } from "@/modules/heuristics/heuristicSetApi.ts";
import {useToast} from "@/composables/useToast.ts";

export function useHeuristic() {
  const heuristicSets = ref<any[]>([]);
  const heuristicSet = ref<any>({ title: '', description: '' });
  const heuristic = ref<any>([]);

  const isLoading = ref(false);
  const { pushToast } = useToast();

  function prepareForTable(data: any[]) {
    return data.map((heuristicSet: any) => ({
      ...heuristicSet,
      link: `/heuristics/${heuristicSet.id}`
    }));
  }

  async function loadHeuristicSets() {
    isLoading.value = true;

    try {
      const rawData = await heuristicSetApi.getAll();
      heuristicSets.value = prepareForTable(rawData);
    } catch (err: any) {
      pushToast(err.message, "error");
    } finally {
      isLoading.value = false;
    }
  }

  async function loadHeuristicSet(heuristicSetId: string, isNew: boolean) {
    isLoading.value = true;

    try {
      if (!isNew) {
        const data = await heuristicSetApi.getById(heuristicSetId);
        heuristicSet.value = data;
        heuristic.value = data.heuristic;
      }
    } catch (err: any) {
      pushToast(err.message, "error");
    } finally {
      isLoading.value = false;
    }
  }

  async function saveHeuristicSet(isNew: boolean) {
    try {
      const payload = heuristicSet.value;

      const savedData = await heuristicSetApi.save(payload, isNew);
      heuristicSet.value = savedData;
      pushToast(savedData.success, "success");

      return savedData;
    } catch (err: any) {
      pushToast(err.message, "error");
      throw err;
    }
  }

  async function addHeuristic() {
    try {
      const payload = heuristicSet.value;
      const newData = await heuristicSetApi.createSingle(payload.id);
      await heuristicSet.value.heuristics.push(newData);
    } catch (err: any) {
      pushToast(err.message, "error");
      throw err;
    }
    window.scrollTo(0, document.body.scrollHeight);
  }

  async function removeHeuristic(id: string) {
    try {
      const setId = heuristicSet.value.id;
      const updatedData = await heuristicSetApi.removeSingle(setId, id);
      heuristicSet.value = updatedData;
      pushToast(updatedData.success, "success");

      return updatedData;
    } catch (err: any) {
      pushToast(err.message, "error");
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
  };
}
