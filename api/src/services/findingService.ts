import {prisma} from "../../lib/prisma";
import {projectService} from "./project.service";
import type {UserWhereInput} from "../../prisma/generated/models/User";

async function getAll(projectId: string, userId = ""): Promise<any> {
  const user = userId ? { id: userId ?? undefined } : undefined;

  return prisma.finding.findMany({
    where: {
      projectId: projectId,
      user: { every: user as UserWhereInput }
    },
    include: {
      user: { include: { UserInProject: true }},
      heuristics: true,
      rating: true,
      images: true,
      mergedFrom: true,
      mergedTo: true,
    }
  });
}

async function getById(id: string, user: any) {
  let finding = await prisma.finding.findUnique({
    where: { id: id },
    include: {
      user: { include: { UserInProject: true }},
      project: { include: {
          ratingset: { include: { ratings: true } },
          heuristicset: { include: { heuristics: true } },
          status: true,
          logo: true
        }},
      heuristics: true,
      rating: true,
      images: true,
      mergedFrom: {
        include: { user: true }
      },
      mergedTo: {
        include: { user: true }
      },
      userRatings: {
        where: { userId: user.Id },
        include: { rating: true }
      }
    },
  });
  if (finding) finding.project = await projectService.addStatusOrder(finding?.project);
  return finding;
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
  let reviewed = undefined;
  let authors = undefined;
  let ratingId = undefined;
  let mergedToId = undefined;
  let mergedFrom = undefined;

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
    reviewed = data.reviewed;
    ratingId = data.ratingId == "" ? null : data.ratingId;
    mergedToId = data.mergedToId == "" ? null : data.mergedToId;
    authors = data.user.map((uid: string) => ({id: uid})) ?? [];
    mergedFrom = data.mergedFrom.map((id: string) => ({id: id})) ?? [];
  }

  await projectService.changes(data.project.id);

  if (data.personalRating == "") {
    await rateRemove(data.id, user);
  } else if (data.personalRating) {
    await rate(data.id, {id: data.personalRating}, user)
  }

  return prisma.finding.update({
    where: { id: data.id },
    data: {
      id: data.id,
      title: data.title,
      description: data.description,
      remarks: data.remarks,
      reviewed: reviewed,
      heuristics: { set: [...data.heuristics.map((hid: string) => ({id: hid}))] },
      user: { set: authors },
      ratingId: ratingId,
      mergedToId: mergedToId,
      mergedFrom: { set: mergedFrom }
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
      images: true,
      mergedTo: true,
      mergedFrom: true
    }
  });
}

async function updateAll(data: any, projectId: string, user: any) {
  await prisma.$transaction(
    Object.values(data).map((f: any) => {
      if (f.newMerge) {
        return prisma.finding.create({
          data: {
            projectId: projectId,
            title: f.title,
            mergedFrom: { connect: [...f.mergedFromIds.map((id: string) => ({id: id}))] }
          },
        });
      } else {
        return prisma.finding.update({
          where: {
            id: f.id
          },
          data: {
            title: f.title,
            reviewed: true,
            mergedFrom: { connect: [...f.mergedFromIds.map((id: string) => ({id: id}))] }
          },
        })
      }
    })
  );

  return await getAll(projectId);
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

async function rateRemove(id: any, user: any) {
  return prisma.userRating.deleteMany({
    where: {
      AND: {
        findingId: id,
        userId: user.id
      }
    }
  });
}

export const findingService = {
  getAll,
  getById,
  getRandom,
  create,
  update,
  updateAll,
  remove,
  rate
};
