import express from 'express';
import cors from "cors";
import { prisma } from '../lib/prisma';
import multer from "multer";
import path from 'path';
import fs from 'fs';

import { customAlphabet, urlAlphabet } from "nanoid";
import projectRoutes from "./routes/project.routes";
import { projectService } from "./services/project.service";
import statusRoutes from "./routes/status.routes";
import heuristicSetRoutes from "./routes/heuristicSet.routes";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import severitySetRoutes from "./routes/severitySet.routes";
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
app.use('/status', statusRoutes);
app.use('/heuristic-sets', heuristicSetRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/severities', severitySetRoutes);

app.post('/finding', async (req:any, res:any) => {
  const data = req.body;

  const authors = data.authors;
  const heuristics = data.heuristics;

  delete data.authors;
  delete data.heuristics;

  try {
    const q = await prisma.finding.create({
      data: {
        ...data,
        user: { connect: [...authors.map(uid => ({id: uid}))] },
        heuristics: { connect: [...heuristics.map(hid => ({id: hid}))] }
      },
      include: {
        user: { include: { UserInProject: true }},
        project: true,
        heuristics: true,
        severity: true,
      }
    });

    res.json(q);
  } catch (error) {
    res.json({ error: error.message });
  }
})

app.put('/finding', async (req:any, res:any) => {
  const data = req.body;

  let authors = data.authors;
  let heuristics = data.heuristics;

  if(authors == null) {
    authors = [];
  }
  if(heuristics == null) {
    heuristics = [];
  }

  delete data.authors;
  delete data.heuristics;

  // Trigger to update the project modification time
  await projectService.changes(data.project.id);

  delete data.project;
  delete data.severity;
  delete data.user;
  delete data.images;

  delete data.updatedat;


  try {
    const q = await prisma.finding.update({
      where: { id: data.id },
      data: {
        ...data,
        user: { set: [...authors.map(uid => ({id: uid}))] },
        heuristics: { set: [...heuristics.map(hid => ({id: hid}))] }
      },
      include: {
        user: { include: { UserInProject: true }},
        project: true,
        heuristics: true,
        severity: true,
      }
    });

    res.json(q);
  } catch (error) {
    res.json({ error: error.message });
  }
})

app.get('/finding/:id', async (req:any, res:any) => {
  const finding = await prisma.finding.findUnique({
    where: {id: req.params.id},
    include: {
      user: { include: { UserInProject: true }},
      project: { include: {
        severityset: { include: { severities: true } },
        heuristicset: { include: { heuristics: true } },
      }},
      heuristics: true,
      severity: true,
      images: true
    }
  });

  res.json(finding);
});


app.listen(3000, () => console.log('API server port 3000'));

