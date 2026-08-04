import express from 'express';
import cors from "cors";
import { prisma } from '../lib/prisma';
import multer from "multer";
import path from 'path';
import fs from 'fs';

import { customAlphabet, urlAlphabet } from "nanoid";
import projectRoutes from "./routes/project.routes";
import statusRoutes from "./routes/status.routes";
import heuristicSetRoutes from "./routes/heuristicSet.routes";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import ratingSetRoutes from "./routes/ratingSet.routes";
import roleRoutes from "./routes/role.routes";
import findingsRoutes from "./routes/finding.routes";
const nanoid = customAlphabet(urlAlphabet, 12);

const app = express();
const upload = multer({storage: multer.memoryStorage()});

app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(express.json());

app.get('/', (req:any, res:any) => {
  res.send("hello hem2api");
});

app.use("/uploads", express.static("uploads"));

app.post("/images/:id", upload.array("image"), async (req, res) => {
  try {
    const findingId = req.params.id;
    const finding = await prisma.finding.findUnique({
      where: { id: findingId },
    });
    const pId = finding?.projectId;

    // TODO: auth

    const files = req.files as Express.Multer.File[];

    const projectDir = path.join(
      process.cwd(),
      "uploads",
      "projects",
      pId
    );

    await fs.promises.mkdir(projectDir, { recursive: true });

    for (const file of files) {
      const extension = "jpg";
      const filename = `finding-${nanoid()}.${extension}`

      file.filename = filename;

      await fs.writeFile(
        path.join(projectDir, filename),
        file.buffer, () => {}
      );
    }

    await prisma.image.createMany({
      data: files.map(file => ({
        filename: file.filename,
        path: `uploads/projects/${pId}/${file.filename}`,
        findingId: findingId
      })),
    });

    const allimages = await prisma.image.findMany({
      where: { findingId: req.params.id }
    });

    res.json(allimages);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: "Upload failed",
    });
  }
});

app.use('/projects', projectRoutes);
app.use('/statuses', statusRoutes);
app.use('/roles', roleRoutes);
app.use('/heuristic-sets', heuristicSetRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/ratingsets', ratingSetRoutes);
app.use('/findings', findingsRoutes);

app.listen(3000, () => console.log('API server port 3000'));

