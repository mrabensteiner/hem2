import {prisma} from "../../lib/prisma";

async function getAll(): Promise<any> {
  return prisma.ratingSet.findMany({
    include: {
      user: true
    }
  });
}

async function getById(id: string) {
  return prisma.ratingSet.findUnique({
    where: { id: id },
    include: {
      ratings: { orderBy: { order: 'asc' } },
      user: true
    }
  });
}

async function create(data: any, user: any) {
  if (!user.role.ratingSetEditAll) {
    data.userId = user.id;
  }

  return prisma.ratingSet.create({
    data: data
  });
}

async function createSingle(id: string) {
  return prisma.rating.create({
    data: { ratingsetId: id }
  });
}

async function remove(data: any) {
  await prisma.ratingSet.delete({
    where: { id: data.id }
  });
  return getAll();
}

async function removeSingle(setId: string, ratingId: string) {
  const findings = await prisma.rating.findUnique({
    where: { id: ratingId },
    select: { Finding: true }
  }).Finding();

  if (findings != null && findings.length > 0) {
    throw Error("Rating is still linked to findings and cannot be removed.")
  }

  await prisma.rating.delete({
    where: { id: ratingId }
  });

  return getById(setId);
}

async function update(data: any, user: any) {
  if (!user.role.ratingSetEditAll) {
    data.userId = user.id;
  }

  await prisma.$transaction(
    data.ratings.map((s: any, i: Number) =>
      prisma.rating.update({
        where: { id: s.id },
        data: {
          ...s,
          order: i
        },
      })
    )
  );

  return await prisma.ratingSet.update({
    where: {id: data.id},
    data: {
      title: data.title,
      description: data.description,
      userId: data.userId
    },
    include: {
      ratings: { orderBy: { order: 'asc' } },
      user: true
    }
  });
}

export const ratingSetService = {
  getAll,
  getById,
  remove,
  removeSingle,
  create,
  createSingle,
  update
};
