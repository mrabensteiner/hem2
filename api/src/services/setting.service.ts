import {prisma} from "../../lib/prisma";

async function getAll(): Promise<any> {
  return prisma.systemSetting.findMany();
}

async function create(data = {}) {
  return prisma.systemSetting.create({
    data: {
      key: "new",
      ...data
    }
  });
}

async function remove(data: any) {
  await prisma.systemSetting.delete({
    where: { key: data.key }
  });
  return getAll();
}

async function updateMany(data: any) {
  return prisma.$transaction(
    data.map((s: any) => {
      return prisma.systemSetting.update({
        where: { key: s.key },
        data: s
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
