import {prisma} from "../../lib/prisma";

async function getAll(): Promise<any> {
  return prisma.systemSetting.findMany();
}

async function create(data = {}) {
  return prisma.systemSetting.create({
    data: data
  });
}

async function remove(data: any) {
  await prisma.systemSetting.delete({
    where: { id: data.id }
  });
  return getAll();
}

async function updateMany(data: any) {
  return prisma.$transaction(
    data.map((s: any, i: Number) => {
      return prisma.systemSetting.update({
        where: { id: s.id },
        data: {
          ...s
        }
      })
    })
  );
}

export const settingService = {
  getAll,
  create,
  remove,
  updateMany,
};
