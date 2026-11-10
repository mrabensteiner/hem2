import {projectService} from "./project.service";
import {prisma} from "../../lib/prisma";
import { Octokit } from '@octokit/rest';
import {Gitlab} from "@gitbeaker/rest";

async function getReportLatex(id: string, user: any): Promise<any> {
  const project= await projectService.getById(id, user);
  return "\\documentclass[11pt]{scrartcl}\n" +
    " \n" +
    " \n" +
    " \n" +
    "\\begin{document}\n" +
    " \n" +
    " \\section{" + project!.title + "}\n" +
    " \n" +
    "\\end{document}";
}

async function findingsGithub(data: any, user: any): Promise<any> {
  const project = await projectService.updateExportService(data);

  const token = project.githubToken;
  const owner = project.githubUser;
  const repo = project.githubRepo;

  const githubApi = new Octokit({ auth: token });

  const findings = await prisma.finding.findMany({
    where: {
      AND: [
        { projectId: project.id },
        { githubLink: "" }
      ]
    }
  });

  for (const f of findings) {
    const link = `http://localhost:5173/project/${f.projectId}/findings/${f.id}`;
    const issue = await githubApi.rest.issues.create({
      owner: owner,
      repo: repo,
      title: f.title,
      body: f.description + `\n\nLink to HEM2: ${link}`,
      labels: ['hem2-import']
    });

    await prisma.finding.update({
      where: {
        id: f.id
      },
      data: {
        githubLink: issue.data.html_url
      },
    });
  }

  return findings.length;
}

async function findingsGitlab(data: any, user: any): Promise<any> {
  const project = await projectService.updateExportService(data);

  const host = project.gitlabHost;
  const token = project.gitlabToken;
  const owner = project.gitlabUser;
  const repo = project.gitlabRepo;

  const gitlabApi = new Gitlab({
    host: host,
    token: token
  });

  const findings = await prisma.finding.findMany({
    where: {
      AND: [
        { projectId: project.id },
        { gitlabLink: "" }
      ]
    }
  });

  for (const f of findings) {
    const link = `http://localhost:5173/project/${f.projectId}/findings/${f.id}`;

    const issue = await gitlabApi.Issues.create(`${owner}/${repo}`,
      f.title,
      {
        description: f.description + `\n\nLink to HEM2: ${link}`,
        labels: 'hem2-import'
      }
    );

    await prisma.finding.update({
      where: {
        id: f.id
      },
      data: {
        gitlabLink: issue.web_url
      },
    });
  }

  return findings.length;
}

export const exportService = {
  getReportLatex,
  findingsGithub,
  findingsGitlab
};
