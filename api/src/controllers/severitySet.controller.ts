import type {Request, Response} from "express";
import {severitySetService} from "../services/severitySet.service";

async function getAll(req: Request, res: Response) {
  try {
    const severitySets = await severitySetService.getAll();
    res.json(severitySets);
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

async function getById(req: Request, res: Response) {
  try {
    const severitySet = await severitySetService.getById(req.params.id as string);
    res.json(severitySet);
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

async function create(req: Request, res: Response) {
  try {
    const severitySet = await severitySetService.create(req.body);
    res.status(201).json(severitySet);
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

async function createSingle(req: Request, res: Response) {
  try {
    const severity = await severitySetService.createSingle(req.params.id as string);
    res.status(201).json(severity);
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

async function remove(req: Request, res: Response) {
  try {
    const severitySet = await severitySetService.remove(req.body);
    res.status(201).json(severitySet);
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

async function removeSingle(req: Request, res: Response) {
  try {
    const severitySet = await severitySetService.removeSingle(req.params.id as string, req.body.id as string);
    res.status(201).json(severitySet);
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

async function update(req: Request, res: Response) {
  try {
    const severitySet = await severitySetService.update(req.body);
    res.json(severitySet);
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

export const severitySetController = {
  getAll,
  getById,
  create,
  createSingle,
  remove,
  removeSingle,
  update,
};
