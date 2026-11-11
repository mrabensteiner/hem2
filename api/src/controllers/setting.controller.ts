import type {Request, Response} from "express";
import {settingService} from "../services/setting.service";

async function getAll(req: Request, res: Response) {
  try {
    const settings = await settingService.getAll();
    res.json({
      data: settings
    });
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

async function create(req: Request, res: Response) {
  try {
    const setting = await settingService.create(req.body);
    res.status(201).json({
      data: setting,
      success: "Added setting successfully."
    });
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

async function remove(req: Request, res: Response) {
  try {
    const setting = await settingService.remove(req.body);
    res.status(201).json({
      data: setting,
      success: "Removed setting successfully."
    });
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

async function updateMany(req: Request, res: Response) {
  try {
    const settings = await settingService.updateMany(req.body);
    res.json({
      data: settings,
      success: "Updated settings successfully."
    });
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

export const settingController = {
  getAll,
  create,
  remove,
  updateMany,
};
