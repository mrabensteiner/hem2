import {prisma} from "../../lib/prisma";

async function getAll(): Promise<any> {
  return prisma.role.findMany();
}

async function create(data = {}) {
  return prisma.role.create({
    data: data
  });
}

async function remove(data: any) {
  await prisma.role.delete({
    where: { id: data.id }
  });
  return getAll();
}

async function updateMany(data: any) {
  return prisma.$transaction(
    data.map((s: any, i: Number) =>
      prisma.role.update({
        where: { id: s.id },
        data: {
          ...s,
          order: i
        },
      })
    )
  );
}

export const roleService = {
  getAll,
  create,
  remove,
  updateMany,
};
