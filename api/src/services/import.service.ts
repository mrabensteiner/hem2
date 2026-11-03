import {prisma} from "../../lib/prisma";
import type * as Prisma from "../../prisma/generated/internal/prismaNamespace";

const titleAppendix = " (JSON Import)";

async function importFindings(projectId: string, data: any[]) {
  await prisma.finding.createMany({
    data: data.map((f: any) => ({
        projectId: projectId,
        title: f.title + titleAppendix,
        description: f.description,
        reviewed: f.reviewed
      })) as Prisma.FindingCreateManyInput[]
  });
}

async function importProject(data: any, user: any) {
  const project = await prisma.project.create({
    data: {
      title: data.title + titleAppendix,
      description: data.description,
      status: {
        connectOrCreate: {
          where: {
            id: data.status.id
          },
          create: {
            title: data.status.title + titleAppendix,
            color: data.status.color,
            textcolor: data.status.textcolor,
            projectViewDetails: data.status.projectViewDetails,
            findingsAdd: data.status.findingsAdd,
            findingsViewOwn: data.status.findingsViewOwn,
            findingsViewAll: data.status.findingsViewAll,
            findingsEditOwn: data.status.findingsEditOwn,
            findingsEditAll: data.status.findingsEditAll,
            ratingEdit: data.status.ratingEdit
          }
        }
      },
      ratingset: {
        connectOrCreate: {
          where: {
            id: data.ratingset.id
          },
          create: {
            title: data.ratingset.title + titleAppendix,
            description: data.ratingset.description,
            userId: null,
            ratings: {
              create: data.ratingset.ratings.map((r: any) => ({
                title: r.title,
                description: r.description,
                color: r.color,
                textcolor: r.textcolor
              }))
            }
          }
        }
      },
      heuristicset: {
        connectOrCreate: {
          where: {
            id: data.heuristicset.id
          },
          create: {
            title: data.heuristicset.title + titleAppendix,
            description: data.heuristicset.description,
            userId: null,
            heuristics: {
              create: data.heuristicset.heuristics.map((h: any) => ({
                title: h.title,
                description: h.description,
                color: h.color,
                textcolor: h.textcolor
              }))
            }
          }
        }
      }
    }
  });

  // Todo: mapping for merged findings, heuristics, ratings, etc.
  await importFindings(project.id, data.Findings);

  return project.id;
}

export const importService = {
  importProject
};
