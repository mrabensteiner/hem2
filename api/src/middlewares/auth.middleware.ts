import type {Request, Response} from "express";
import jwt from "jsonwebtoken";
import {prisma} from "../../lib/prisma";

const JWT_SECRET = process.env.JWT_SECRET || "super-secure-secret-key";

export const requireAuth = async (req: Request, res: Response, next: Function): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith("Bearer ")) {
    res.status(401).json({ error: "Token missing." });
    return;
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = await jwt.verify(token as string, JWT_SECRET) as { id: string };

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
      select: { id: true, email: true, firstname: true, lastname: true, role: true }
    });

    if (!user) {
      res.status(401).json({ error: "Invalid token." });
      return;
    }

    req.user = user;

    next();
  } catch (error) {
    res.status(401).json({ error: 'Session has expired.' });
  }
};
