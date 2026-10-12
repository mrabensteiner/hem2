import {prisma} from "../../lib/prisma";
import {projectService} from "./project.service";

async function getAll(projectId: string, userId = ""): Promise<any> {
  return prisma.finding.findMany({
    where: {
      projectId: projectId,
      user: { every: { id: userId ?? undefined } },
    },
    include: {
      user: { include: { UserInProject: true }},
      project: { include: {
          ratingset: { include: { ratings: true } },
          heuristicset: { include: { heuristics: true } },
        }},
      heuristics: true,
      rating: true,
      images: true
    }
  });
}

async function getById(id: string, user: any) {
  return prisma.finding.findUnique({
    where: { id: id },
    include: {
      user: { include: { UserInProject: true }},
      project: { include: {
          ratingset: { include: { ratings: true } },
          heuristicset: { include: { heuristics: true } },
          logo: true
        }},
      heuristics: true,
      rating: true,
      images: true,
      userRatings: {
        where: { userId: user.Id },
        include: { rating: true }
      }
    },
  });
}

async function getRandom(pid: string, user: any) {
  return prisma.finding.findFirst({
    where: {
      projectId: pid,
      userRatings: { none: { userId: user.id }}
    },
    include: {
      user: { include: { UserInProject: true }},
      project: { include: {
          ratingset: { include: { ratings: true } },
          heuristicset: { include: { heuristics: true } },
          logo: true
        }},
      heuristics: true,
      rating: true,
      images: true,
      userRatings: true
    },
  });
}

async function create(data: any, user: any) {
  const privileges = await projectService.getPrivileges(data.projectId);
  let authors = data.user ?? [];
  let heuristics = data.heuristics ?? [];

  if (!privileges?.managers.includes(user.id) && !user.role.projectEditAll) {
    if (!privileges?.members.includes(user.id) || !privileges?.specific.findingsAdd) {
      throw Error("No privileges");
    }

    authors = [user.id];
  }

  delete data.user;
  delete data.heuristics;

  projectService.changes(data.projectId);

  return prisma.finding.create({
    data: {
      ...data,
      user: { connect: [...authors.map((uid: string) => ({id: uid}))] },
      heuristics: { connect: [...heuristics.map((hid: string) => ({id: hid}))] }
    },
    include: {
      user: {
        include: {
          UserInProject: true
        }
      },
      project: {
        include: {
          ratingset: { include: { ratings: true } },
          heuristicset: { include: { heuristics: true } },
        }
      },
      heuristics: true,
      rating: true,
      images: true
    }
  });
}

async function update(data: any, user: any) {
  const privileges = await projectService.getPrivileges(data.projectId);
  let authors = undefined;
  let ratingId = undefined;

  if (!privileges?.managers.includes(user.id) && !user.role.projectEditAll) {
    if (!privileges?.members.includes(user.id) || !privileges?.specific.findingsAdd) {
      throw Error("No privileges to edit findings.");
    }

    const finding = await prisma.finding.findUnique({
      where: {
        id: data.id
      },
      select: {
        user: true
      }
    });

    if (!finding?.user.find(u => u.id == user.id)) {
      throw Error("No privileges to edit this finding.");
    }
  } else {
    authors = data.user.map((uid: string) => ({id: uid})) ?? [];
    ratingId = data.ratingId;
  }

  await projectService.changes(data.project.id);

  if (data.personalRating && data.personalRating != "") await rate(data.id, {id: data.personalRating}, user);

  return prisma.finding.update({
    where: { id: data.id },
    data: {
      id: data.id,
      title: data.title,
      description: data.description,
      heuristics: { set: [...data.heuristics.map((hid: string) => ({id: hid}))] },
      user: { set: authors },
      ratingId: ratingId
    },
    include: {
      user: { include: { UserInProject: true }},
      project: { include: {
          ratingset: { include: { ratings: true } },
          heuristicset: { include: { heuristics: true } },
          logo: true
        }},
      heuristics: true,
      rating: true,
      userRatings: {
        where: { userId: user.Id },
        include: { rating: true }
      },
      images: true
    }
  });
}

async function remove(data: any) {
  return prisma.finding.delete({
    where: { id: data.id }
  });
}

async function rate(id: any, rating: any, user: any) {
  return prisma.userRating.upsert({
    where: {
      userId_findingId: {
        findingId: id,
        userId: user.id
      }
    },
    update: {
      ratingId: rating.id
    },
    create: {
      userId: user.id,
      findingId: id,
      ratingId: rating.id
    }
  })
}


export const findingService = {
  getAll,
  getById,
  getRandom,
  create,
  update,
  remove,
  rate
};
