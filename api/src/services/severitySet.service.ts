import {prisma} from "../../lib/prisma";

async function getAll(): Promise<any> {
  return prisma.severitySet.findMany();
}

async function getById(id: string) {
  return prisma.severitySet.findUnique({
    where: { id: id },
    include: { severities: true }
  });
}

async function create(data = {}) {
  return prisma.severitySet.create({
    data: data
  });
}

async function createSingle(id: string) {
  return prisma.severity.create({
    data: { severitysetId: id }
  });
}

async function remove(data: any) {
  await prisma.severitySet.delete({
    where: { id: data.id }
  });
  return getAll();
}

async function removeSingle(setId: string, severityId: string) {
  const findings = await prisma.severity.findUnique({
    where: { id: severityId },
    select: { Finding: true }
  }).Finding();

  if (findings != null && findings.length > 0) {
    throw Error("Severity is still linked to findings and cannot be removed.")
  }

  await prisma.severity.delete({
    where: { id: severityId }
  });

  return getById(setId);
}

async function update(data: any) {
  await prisma.$transaction(
    data.severities.map((s: any, i: Number) =>
      prisma.severity.update({
        where: { id: s.id },
        data: {
          ...s,
          order: i
        },
      })
    )
  );

  return await prisma.severitySet.update({
    where: {id: data.id},
    data: {
      title: data.title,
      description: data.description
    },
    include: { severities: true }
  });
}

export const severitySetService = {
  getAll,
  getById,
  remove,
  removeSingle,
  create,
  createSingle,
  update
};
