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

async function getById(id: string) {
  return prisma.finding.findUnique({
    where: { id: id },
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

async function create(data: any, user: any) {
  let authors = data.user ?? [];
  let heuristics = data.heuristics ?? [];

  if (!user.role.projectEditAll) {
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

async function update(data: any, user: any) {
  let authors = data.user ?? [];
  let heuristics = data.heuristics ?? [];

  if (!user.role.projectEditAll) {
    authors = [user.id];
  }

  delete data.authors;
  delete data.heuristics;

  projectService.changes(data.project.id);

  delete data.project;
  delete data.rating;
  delete data.user;
  delete data.images;
  delete data.updatedat;

  return prisma.finding.update({
    where: { id: data.id },
    data: {
      ...data,
      user: { set: [...authors.map((uid: string) => ({id: uid}))] },
      heuristics: { set: [...heuristics.map((hid: string) => ({id: hid}))] }
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

async function remove(data: any) {
  return prisma.finding.delete({
    where: { id: data.id }
  });
}

export const findingService = {
  getAll,
  getById,
  create,
  update,
  remove,
};
