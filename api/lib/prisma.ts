import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import { loadEnvFile } from 'node:process';
import bcrypt from 'bcrypt';

loadEnvFile('./../.env');

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter }).$extends({
  query: {
    user: {
      async create({ args, query }) {
        args.data.password = bcrypt.hashSync(args.data['password'] as string, 10);
        return query(args);
      },
      async update({ args, query }) {
        args.data.password = bcrypt.hashSync(args.data['password'] as string, 10);
        return query(args);
      }
    },
  },
});

export { prisma };
