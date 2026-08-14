import type {Request, Response} from "express";
import { authService } from '../services/auth.service.js';

async function login(req: Request, res: Response): Promise<void> {
  const {username, password} = req.body;

  if (!username || !password) {
    res.status(400).json({error: 'Username and password required.'});
    return;
  }

  try {
    const result = await authService.login(username, password);
    res.json(result);
  } catch (error: any) {
    const status = error.message.includes('Wrong username or password.') ? 401 : 500;
    res.status(status).json({error: error.message});
  }
}

async function getUser(req: any, res: Response): Promise<void> {
  res.json({ user: req.user });
}

export const authController = {
  login,
  getUser
};
