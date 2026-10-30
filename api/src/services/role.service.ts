import {prisma} from "../../lib/prisma";

async function getAll(): Promise<any> {
  return prisma.role.findMany({
    include: {
      userEditRoles: true,
      canBeEditedFrom: { select: { id: true } }
    }
  });
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
    data.map((s: any, i: Number) => {
      if (s.userAdd && !s.userEditAll) {
        s.userEditRoles = {
          set: [],
          connect: [...(s.userEditRoleIds ?? []).map((id: string) => ({id: id}))]
        };
      } else {
        s.userEditRoles = { set: [] };
      }
      delete s.userEditRoleIds;
      delete s.canBeEditedFrom;

      return prisma.role.update({
        where: { id: s.id },
        data: {
          ...s,
          order: i
        },
        include: {
          userEditRoles: true
        },
      })
    })
  );
}

export const roleService = {
  getAll,
  create,
  remove,
  updateMany,
};
