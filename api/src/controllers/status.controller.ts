import type {Request, Response} from "express";
import {statusService} from "../services/status.service";

async function getAll(req: Request, res: Response) {
  try {
    const statuses = await statusService.getAll();
    res.json(statuses);
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

async function create(req: Request, res: Response) {
  try {
    const status = await statusService.create(req.body);
    res.status(201).json({
      ...status,
      success: "Added status successfully."
    });
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

async function remove(req: Request, res: Response) {
  try {
    const status = await statusService.remove(req.body);
    res.status(201).json({
      ...status,
      success: "Removed status successfully."
    });
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

async function updateMany(req: Request, res: Response) {
  try {
    const statuses = await statusService.updateMany(req.body);
    res.json({
      ...statuses,
      success: "Updated statuses successfully."
    });
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

export const statusController = {
  getAll,
  create,
  remove,
  updateMany,
};
