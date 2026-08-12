import {prisma} from "../../lib/prisma";

async function getAll(): Promise<any> {
  return prisma.project.findMany({
    include: {
      UserInProject: { include: { user: true } },
      heuristicset: true,
      ratingset: true,
      status: true,
      _count: { select: { Findings: true } }
    }
  });
}

async function getById(id: string) {
  return prisma.project.findUnique({
    where: {id: id},
    include: {
      UserInProject: { include: { user: true }},
      heuristicset: { include: { heuristics: true }},
      ratingset: { include: { ratings: true }},
      status: true,
      Findings: { include: { user: true, heuristics: true , rating: true, userRatings: true }}
    }
  });
}

async function create(data: any) {

  const managers = data.managers;
  const members = data.members.filter((uid: string) => !managers.includes(uid));

  delete data.members;
  delete data.managers;

  const project = await prisma.project.create({
    data: data,
    include: {
      UserInProject: { include: { user: true }},
      heuristicset: true,
      ratingset: true,
      status: true,
      Findings: { include: { user: true, heuristics: true , rating: true }}
    }
  })
  const projectId = project.id;

  await prisma.userInProject.createMany({
    data: [
      ...members.map((userId: string) => ({
        userId: userId, projectId: projectId, projectRole: "MEMBER"
      })),
      ...managers.map((userId: string) => ({
        userId: userId, projectId: projectId, projectRole: "MANAGER"
      })),
    ]
  });

  return project;
}

async function update(data: any) {
  const managers = data.managers;
  const members = data.members.filter((uid: string) => !managers.includes(uid));

  await prisma.userInProject.deleteMany({
    where: { projectId: data.id },
  })

  await prisma.userInProject.createMany({
    data: [
      ...members.map((uid: string) => ({
        userId: uid, projectId: data.id, projectRole: "MEMBER"
      })),
      ...managers.map((uid: string) => ({
        userId: uid, projectId: data.id, projectRole: "MANAGER"
      })),
    ]
  })

  return prisma.project.update({
    where: { id: data.id },
    data: {
      title: data.title,
      description: data.description,
      heuristicsetId: data.heuristicsetId,
      ratingsetId: data.ratingsetId
    },
    include: {
      UserInProject: { include: { user: true }},
      heuristicset: true,
      ratingset: true,
      status: true,
      Findings: { include: { user: true, heuristics: true , rating: true }}
    }
  });
}

async function changes(id: string) {
  return prisma.project.update({
    where: { id },
    data: { updatedat: new Date() }
  });
}

export const projectService = {
  getById,
  getAll,
  create,
  update,
  changes
};
