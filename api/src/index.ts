const express = require('express');
const cors = require("cors");
import { prisma } from "../lib/prisma";
import multer = require("multer");

const app = express();
const upload = multer({ dest: 'images/' });

app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(express.json());

app.get('/', (req:any, res:any) => {
  res.send("hello hem2api");
});

app.use("/images", express.static("images"));

app.post("/images", upload.array("image"), async (req, res) => {
  const files = req.files as Express.Multer.File[];
  res.json(files);
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
      heuristicset: { include: { heuristics: true }},
      severityset: { include: { severities: true }},
      status: true,
      Findings: { include: { user: true, heuristics: true , severity: true }}
    }
  });

  res.json(projects);
});


app.put('/project', async (req:any, res:any) => {
  const data = req.body;

  const managers = data.managers;
  const members = data.members.filter(uid => !managers.includes(uid));

  await prisma.userInProject.deleteMany({
    where: { projectId: data.id },
  })

  await prisma.userInProject.createMany({
    data: [
      ...members.map(uid => ({
        userId: uid, projectId: data.id, projectRole: "MEMBER"
      })),
      ...managers.map(uid => ({
        userId: uid, projectId: data.id, projectRole: "MANAGER"
      })),
    ]
  })

  try {
    const q = await prisma.project.update({
      where: { id: data.id },
      data: {
        title: data.title,
        description: data.description,
      },
      include: {
        UserInProject: { include: { user: true }},
        heuristicset: true,
        severityset: true,
        status: true,
        Findings: { include: { user: true, heuristics: true , severity: true }}
      }
    })
    res.json(q);
  } catch (error) {
    res.json({ error: error.message });
  }
})

app.post('/project', async (req:any, res:any) => {
  const data = req.body;

  const managers = data.managers;
  const members = data.members.filter(uid => !managers.includes(uid));

  delete data.members;
  delete data.managers;

  try {
    const q = await prisma.project.create({
      data: data,
      include: {
        UserInProject: { include: { user: true }},
        heuristicset: true,
        severityset: true,
        status: true,
        Findings: { include: { user: true, heuristics: true , severity: true }}
      }
    })
    const id = q.id;

    await prisma.userInProject.createMany({
      data: [
        ...members.map(uid => ({
          userId: uid, projectId: id, projectRole: "MEMBER"
        })),
        ...managers.map(uid => ({
          userId: uid, projectId: id, projectRole: "MANAGER"
        })),
      ]
    })

    res.json(q);
  } catch (error) {
    res.json({ error: error.message });
  }
})

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
  await prisma.project.update({
    where: { id: data.project.id },
    data: { updatedat: new Date() }
  });

  delete data.project;
  delete data.severity;
  delete data.user;

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

app.get('/severities/{:id}', async (req:any, res:any) => {
  const q = await prisma.severity.findMany({
    where: { severitysetId: req.params.id },
  });
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
  if (q == null) {
    res.json({"msg": "User not found"});
  }
  res.json(q);
});

app.post(`/user`, async (req:any, res:any) => {
  const data = req.body;
  const q = await prisma.user.create({
    data: data
  })
  q.msg = "Added Successfully";
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

