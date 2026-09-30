import type {Request, Response} from "express";
import {projectService} from "../services/project.service";
import {exportService} from "../services/export.service";

async function projectJson(req: Request, res: Response) {
  try {
    const project = await projectService.getById(req.params.id as string, req.user);
    res.contentType("application/json").json(project);
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

async function projectReportLatex(req: Request, res: Response) {
  try {
    const latex = await exportService.getReportLatex(req.params.id as string, req.user);
    res.contentType("text/x-tex").send(latex);
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

export const exportController = {
  projectJson,
  projectReportLatex
};
