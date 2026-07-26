import {prisma} from "../../lib/prisma";

async function getAll(): Promise<any> {
  return prisma.status.findMany();
}

async function create(data = {}) {
  return prisma.status.create({
    data: data
  });
}

async function remove(data: any) {
  await prisma.status.delete({
    where: { id: data.id }
  });
  return getAll();
}

async function updateMany(data: any) {
  return prisma.$transaction(
    data.map((s: any, i: Number) =>
      prisma.status.update({
        where: { id: s.id },
        data: {
          ...s,
          order: i
        },
      })
    )
  );
}

export const statusService = {
  getAll,
  create,
  remove,
  updateMany,
};
