import type {Request, Response} from "express";
import {findingService} from "../services/findingService";

async function getAll(req: Request, res: Response) {
  try {
    const findings = await findingService.getAll(req.body.id as string);
    res.json({
      data: findings
    });
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

async function getById(req: Request, res: Response) {
  try {
    const finding = await findingService.getById(req.params.id as string);
    res.json({
      data: {
        ...finding,
        userRatings: finding?.userRatings.find(ur => ur.userId == req.user?.id)?.ratingId
      }
    });
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

async function getRandom(req: Request, res: Response) {
  try {
    const finding = await findingService.getRandom(req.params.pid as string, req.user);
    res.json({
      data: {
        ...finding,
        userRatings: finding?.userRatings.find(ur => ur.userId == req.user?.id)?.ratingId
      }
    });
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

async function create(req: Request, res: Response) {
  try {
    const finding = await findingService.create(req.body, req.user);
    res.status(201).json({
      data: finding,
      success: "Created finding successfully."
    });
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

async function remove(req: Request, res: Response) {
  try {
    const finding = await findingService.remove(req.body);
    res.status(201).json({
      data: finding,
      success: "Removed finding."
    });
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

async function update(req: Request, res: Response) {
  try {
    const finding = await findingService.update(req.body, req.user);
    res.json({
      data: finding,
      success: "Updated finding set successfully."
    });
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

async function rate(req: Request, res: Response) {
  try {
    await findingService.rate(req.params.id, req.body, req.user);
    res.json({
      success: "Finding rated successfully."
    });
  } catch (error: any) {
    res.status(500).json({error: error.message});
  }
}

export const findingController = {
  getAll,
  getById,
  getRandom,
  create,
  remove,
  update,
  rate
};
