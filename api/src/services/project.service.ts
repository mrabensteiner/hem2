import {prisma} from "../../lib/prisma";
import {projectRole} from "../../prisma/generated/enums";

async function getAll(user: any): Promise<any> {
  const where = user.role.projectViewAll ? {} : {
    UserInProject: { some: { userId: user.id } }
  };

  return prisma.project.findMany({
    include: {
      UserInProject: { include: { user: true } },
      heuristicset: true,
      ratingset: true,
      status: true,
      logo: true,
      _count: { select: { Findings: true } }
    },
    where: where
  });
}

async function getById(id: string, user: any) {
  let project: any = await prisma.project.findUnique({
    where: {id: id},
    include: {
      UserInProject: { include: { user: true }},
      heuristicset: { include: { heuristics: true }},
      ratingset: { include: { ratings: true }},
      status: true,
      logo: true,
      Findings: { include: { user: true, heuristics: true , rating: true, userRatings: true, images: true }}
    }
  });

  checkProjectPrivileges(project, user, "projectViewDetails", "projectViewAll");

  if (project?.status) {
    project = await addStatusOrder(project);
  }

  const uip = project?.UserInProject.find((u: any) => u.userId === user.id);

  if (uip?.projectRole == "MANAGER" || project?.status.findingsViewAll || user.role.projectViewAll) {
    return project;
  }

  if (project?.status.findingsViewOwn) {
    project.Findings = project?.Findings.filter(f => f.user.find(u => u.id == user.id))
  } else if (project) {
    project.Findings = [];
  }

  return project;
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

  let project = await prisma.project.update({
    where: { id: data.id },
    data: {
      title: data.title,
      description: data.description,
      heuristicsetId: data.heuristicsetId,
      ratingsetId: data.ratingsetId,
      statusId: data.statusId
    },
    include: {
      UserInProject: { include: { user: true }},
      heuristicset: true,
      ratingset: true,
      status: true,
      logo: true,
      Findings: { include: { user: true, heuristics: true , rating: true }}
    }
  });

  return await addStatusOrder(project);
}

async function updateStatus(data: any) {
  const id = data.id;
  const statusId = data.statusId;

  let project = await prisma.project.update({
    where: { id },
    data: {
      status: {
        connect: {
          id: statusId
        }
      }
    },
    include: {
      UserInProject: { include: { user: true }},
      heuristicset: true,
      ratingset: true,
      status: true,
      logo: true,
      Findings: { include: { user: true, heuristics: true , rating: true }}
    }
  });

  return await addStatusOrder(project);
}

async function changes(id: string) {
  return prisma.project.update({
    where: { id },
    data: { updatedat: new Date() }
  });
}

function checkProjectPrivileges(project: any, user: any, projectPrivilege: string, privilege: string) {
  if (user.role[privilege]) return;

  const uip = project?.UserInProject.find((u: any) => u.userId === user.id);

  if (uip == undefined && !user.role.projectEditAll) {
    throw new Error("Access denied.");
  } else if (uip.projectRole == "MEMBER" && !project?.status[projectPrivilege]) {
    throw new Error("Not possible in this project status.");
  }
}

async function addStatusOrder(project: any) {
  const prev = await prisma.status.findFirst({
    where: {
      order: {
        lt: project.status.order
      }
    },
    orderBy: {
      order: "desc",
    },
    select: {
      id: true
    }
  });

  const next = await prisma.status.findFirst({
    where: {
      order: {
        gt: project.status.order
      }
    },
    orderBy: {
      order: "asc",
    },
    select: {
      id: true
    }
  });

  return {
    ...project,
    status: {
      ...project.status,
      prev: prev,
      next: next
    }
  }
}

async function getPrivileges(id: string) {
  const project = await prisma.project.findUnique({
    where: {id: id},
    select: {
      UserInProject: { include: { user: true }},
      status: {
        omit: {
          id: true,
          title: true,
          color: true,
          textcolor: true,
          order: true
        }
      }
    }
  });

  if (project == null) {
    return null;
  }

  return {
    managers: project.UserInProject.filter(uip => uip.projectRole == projectRole.MANAGER).map(uip => uip.userId),
    members: project.UserInProject.filter(uip => uip.projectRole == projectRole.MEMBER).map(uip => uip.userId),
    specific: project.status,
  }
}

export const projectService = {
  getById,
  getAll,
  create,
  update,
  updateStatus,
  addStatusOrder,
  changes,
  getPrivileges
};
