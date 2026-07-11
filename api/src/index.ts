const express = require('express');
import { prisma } from "../lib/prisma";

const app = express();
app.use(express.json());

app.get('/', (req, res) => {
  res.send("hello hem2api");
});

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.listen(3000, () => console.log('API server port 3000'));

