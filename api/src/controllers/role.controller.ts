import type {Request, Response} from "express";
import {roleService} from "../services/role.service";

async function getAll(req: Request, res: Response) {
  try {
    const roles = await roleService.getAll();
    res.json({
      data: roles
    });
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

async function create(req: Request, res: Response) {
  try {
    const role = await roleService.create(req.body);
    res.status(201).json({
      data: role,
      success: "Added role successfully."
    });
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

async function remove(req: Request, res: Response) {
  try {
    const role = await roleService.remove(req.body);
    res.status(201).json({
      data: role,
      success: "Removed role successfully."
    });
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

async function updateMany(req: Request, res: Response) {
  try {
    const roles = await roleService.updateMany(req.body);
    res.json({
      data: roles,
      success: "Updated roles successfully."
    });
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

export const roleController = {
  getAll,
  create,
  remove,
  updateMany,
};
