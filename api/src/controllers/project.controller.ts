import type {Request, Response} from "express";
import {projectService} from "../services/project.service";

async function getAll(req: Request, res: Response) {
  try {
    const projects = await projectService.getAll();
    res.json(projects);
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

async function getById(req: Request, res: Response) {
  try {
    const project = await projectService.getById(req.params.id as string);
    res.json(project);
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

async function create(req: Request, res: Response) {
  try {
    const project = await projectService.create(req.body);
    res.status(201).json({
      ...project,
      success: "Created project successfully."
    });
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

async function update(req: Request, res: Response) {
  try {
    const project = await projectService.update(req.body);
    res.json({
      ...project,
      success: "Updated project successfully."
    });
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

export const projectController = {
  getAll,
  getById,
  create,
  update
};
