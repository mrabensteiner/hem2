import {prisma} from "../../lib/prisma";

async function getAll(): Promise<any> {
  return prisma.user.findMany();
}

async function getById(id: string) {
  return prisma.user.findUnique({
    where: { id }
  });
}

async function create(data: any) {
  return prisma.user.create({
    data: data
  })
}

async function update(data: any) {
  delete data.role;
  return prisma.user.update({
    where: { id: data.id },
    data: {
      username: data.username,
      firstname: data.firstname,
      lastname: data.lastname,
      roleId: data.roleId,
      password: data.password,
    }
  });
}

export const userService = {
  getById,
  getAll,
  create,
  update
};
