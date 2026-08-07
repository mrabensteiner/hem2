import express from 'express';
import cors from "cors";

import projectRoutes from "./routes/project.routes";
import statusRoutes from "./routes/status.routes";
import heuristicSetRoutes from "./routes/heuristicSet.routes";
import authRoutes from "./routes/auth.routes";
import userRoutes from "./routes/user.routes";
import ratingSetRoutes from "./routes/ratingSet.routes";
import roleRoutes from "./routes/role.routes";
import findingsRoutes from "./routes/finding.routes";
import imageRoutes from "./routes/image.routes";

const app = express();

app.use(cors({
  origin: "http://localhost:5173"
}));
app.use(express.json());

app.get('/', (req:any, res:any) => {
  res.send("hello hem2api");
});

app.use("/uploads", express.static("uploads"));

app.use('/projects', projectRoutes);
app.use('/statuses', statusRoutes);
app.use('/roles', roleRoutes);
app.use('/heuristic-sets', heuristicSetRoutes);
app.use('/auth', authRoutes);
app.use('/users', userRoutes);
app.use('/ratingsets', ratingSetRoutes);
app.use('/findings', findingsRoutes);
app.use('/images', imageRoutes);

app.listen(3000, () => console.log('API server port 3000'));

