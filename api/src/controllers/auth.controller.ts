import type {Request, Response} from "express";
import { authService } from '../services/auth.service.js';

async function login(req: Request, res: Response): Promise<void> {
  const {username, password} = req.body;
  console.log(req.body);
  if (!username || !password) {
    res.status(400).json({error: 'Username and password required.'});
    return;
  }

  try {
    const result = await authService.login(username, password);
    res.json(result);
  } catch (error: any) {
    const status = error.message.includes('Falsche') ? 401 : 500;
    res.status(status).json({error: error.message});
  }
}

export const authController = {
  login,
};
