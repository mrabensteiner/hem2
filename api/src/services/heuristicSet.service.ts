import {prisma} from "../../lib/prisma";

async function getAll(): Promise<any> {
  return prisma.heuristicSet.findMany();
}

async function getById(id: string) {
  return prisma.heuristicSet.findUnique({
    where: { id: id },
    include: { heuristics: true }
  });
}

async function create(data = {}) {
  return prisma.heuristicSet.create({
    data: data
  });
}

async function createSingle(id: string) {
  return prisma.heuristic.create({
    data: { heuristicsetId: id }
  });
}

async function remove(data: any) {
  await prisma.heuristicSet.delete({
    where: { id: data.id }
  });
  return getAll();
}

async function removeSingle(setId: string, heuristicId: string) {
  const findings = await prisma.heuristic.findUnique({
    where: { id: heuristicId },
    select: { Finding: true }
  }).Finding();

  if (findings != null && findings.length > 0) {
    throw Error("Heuristic is still linked to findings and cannot be removed.")
  }

  await prisma.heuristic.delete({
    where: { id: heuristicId }
  });

  return getById(setId);
}

async function update(data: any) {
  await prisma.$transaction(
    data.heuristics.map((s: any, i: Number) =>
      prisma.heuristic.update({
        where: { id: s.id },
        data: {
          ...s,
          order: i
        },
      })
    )
  );

  return await prisma.heuristicSet.update({
    where: {id: data.id},
    data: {
      title: data.title,
      description: data.description
    },
    include: { heuristics: true }
  });
}

export const heuristicSetService = {
  getAll,
  getById,
  remove,
  removeSingle,
  create,
  createSingle,
  update
};
