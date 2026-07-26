import type {Request, Response} from "express";
import {userService} from "../services/user.service";

async function getAll(req: Request, res: Response) {
  try {
    const users = await userService.getAll();
    res.json(users);
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

async function getById(req: Request, res: Response) {
  try {
    const user = await userService.getById(req.params.id as string);
    res.json(user);
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

async function create(req: Request, res: Response) {
  try {
    const user = await userService.create(req.body);
    res.status(201).json(user);
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

async function update(req: Request, res: Response) {
  try {
    const user = await userService.update(req.body);
    res.json(user);
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

export const userController = {
  getAll,
  getById,
  create,
  update
};
