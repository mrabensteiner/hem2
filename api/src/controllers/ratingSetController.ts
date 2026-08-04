import type {Request, Response} from "express";
import {ratingSetService} from "../services/ratingSetService";

async function getAll(req: Request, res: Response) {
  try {
    const ratingSets = await ratingSetService.getAll();
    res.json(ratingSets);
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

async function getById(req: Request, res: Response) {
  try {
    const ratingSet = await ratingSetService.getById(req.params.id as string);
    res.json(ratingSet);
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

async function create(req: Request, res: Response) {
  try {
    const ratingSet = await ratingSetService.create(req.body);
    res.status(201).json({
      ...ratingSet,
      success: "Created rating set successfully."
    });
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

async function createSingle(req: Request, res: Response) {
  try {
    const rating = await ratingSetService.createSingle(req.params.id as string);
    res.status(201).json(rating);
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

async function remove(req: Request, res: Response) {
  try {
    const ratingSet = await ratingSetService.remove(req.body);
    res.status(201).json({
      ...ratingSet,
      success: "Removed rating set."
    });
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

async function removeSingle(req: Request, res: Response) {
  try {
    const ratingSet = await ratingSetService.removeSingle(req.params.id as string, req.body.id as string);
    res.status(201).json({
      ...ratingSet,
      success: "Removed rating."
    });
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

async function update(req: Request, res: Response) {
  try {
    const ratingSet = await ratingSetService.update(req.body);
    res.json({
      ...ratingSet,
      success: "Updated rating set successfully."
    });
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

export const ratingSetController = {
  getAll,
  getById,
  create,
  createSingle,
  remove,
  removeSingle,
  update,
};
