import {prisma} from "../../lib/prisma";

const userSelect = {
  id: true,
  username: true,
  email: true,
  firstname: true,
  lastname: true,
  role: true
};

async function getAll(): Promise<any> {
  return prisma.user.findMany({
    select: userSelect
  });
}

async function getById(id: string) {
  return prisma.user.findUnique({
    where: { id },
    select: userSelect
  });
}

async function create(data: any) {
  return prisma.user.create({
    data: data,
    select: userSelect
  })
}

async function update(data: any) {
    return prisma.user.update({
    where: { id: data.id },
    data: data,
    select : userSelect
  });
}

export const userService = {
  getById,
  getAll,
  create,
  update
};
