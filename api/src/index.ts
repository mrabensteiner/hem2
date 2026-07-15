const express = require('express');
const cors = require("cors");
import { prisma } from "../lib/prisma";

const app = express();

app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(express.json());

app.get('/', (req:any, res:any) => {
  res.send("hello hem2api");
});

app.get('/projects', async (req:any, res:any) => {
  const projects = await prisma.project.findMany({
    include: {
       UserInProject: { include: { user: true } },
       heuristicset: true,
       severityset: true,
       status: true,
       _count: { select: { Findings: true } }
    }
  });
  res.json(projects);
});

app.get('/project/:id', async (req:any, res:any) => {
  const projects = await prisma.project.findUnique({
    where: {id: req.params.id},
    include: {
      UserInProject: { include: { user: true }},
      heuristicset: true,
      severityset: true,
      status: true,
      Findings: true
    }
  });

  res.json(projects);
});


app.put('/project', async (req:any, res:any) => {
  const data = req.body;
  console.log(data)
  try {
    const q = await prisma.project.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
      }
    })
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
      project: true,
      heuristics: true,
      severity: true,
    }
  });

  res.json(finding);
});

app.get('/statuses', async (req:any, res:any) => {
  const q = await prisma.status.findMany();
  res.json(q);
});

app.get('/heuristics', async (req:any, res:any) => {
  const q = await prisma.heuristicSet.findMany();
  res.json(q);
});

app.get('/severities', async (req:any, res:any) => {
  const q = await prisma.severitySet.findMany();
  res.json(q);
});

// ### USER ###########################################################

app.get('/users', async (req:any, res:any) => {
  const q = await prisma.user.findMany({
    where: { id: req.params.id }
  });
  res.json(q);
});

app.get('/user/:id', async (req:any, res:any) => {
  const q = await prisma.user.findUnique({
    where: { id: req.params.id }
  });
  res.json(q);
});

app.post(`/user`, async (req:any, res:any) => {
  const data = req.body;
  const q = await prisma.user.create({
    data: data
  })
  res.json(q);
});

app.put('/user', async (req:any, res:any) => {
  const data = req.body;
  try {
    const q = await prisma.user.update({
      where: { id: data.id },
      data: data
    })
    res.json(q);
  } catch (error) {
    res.json({ error: `ID ${data.id} does not exist in the database` })
  }
})

// ####################################################################

app.listen(3000, () => console.log('API server port 3000'));

