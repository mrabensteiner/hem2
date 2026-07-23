import type {Request, Response} from "express";
import {heuristicSetService} from "../services/heuristicSet.service";

async function getAll(req: Request, res: Response) {
  try {
    const heuristicSets = await heuristicSetService.getAll();
    res.json(heuristicSets);
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

async function getById(req: Request, res: Response) {
  try {
    const heuristicSet = await heuristicSetService.getById(req.params.id as string);
    res.json(heuristicSet);
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

async function create(req: Request, res: Response) {
  try {
    const heuristicSet = await heuristicSetService.create(req.body);
    res.status(201).json(heuristicSet);
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

async function createSingle(req: Request, res: Response) {
  try {
    const heuristic = await heuristicSetService.createSingle(req.params.id as string);
    res.status(201).json(heuristic);
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

async function remove(req: Request, res: Response) {
  try {
    const heuristicSet = await heuristicSetService.remove(req.body);
    res.status(201).json(heuristicSet);
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

async function removeSingle(req: Request, res: Response) {
  try {
    const heuristicSet = await heuristicSetService.removeSingle(req.params.id as string, req.body.id as string);
    res.status(201).json(heuristicSet);
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

async function update(req: Request, res: Response) {
  try {
    const heuristicSet = await heuristicSetService.update(req.body);
    res.json(heuristicSet);
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

export const heuristicSetController = {
  getAll,
  getById,
  create,
  createSingle,
  remove,
  removeSingle,
  update,
};
