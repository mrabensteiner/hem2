import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../prisma/generated/client";
import { loadEnvFile } from "node:process";
import bcrypt from 'bcrypt';

loadEnvFile('./../.env');

const connectionString = `${process.env.DATABASE_URL}`;

const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({
    adapter: adapter,
    omit: {
      user: {
        password: true,
      },
    },
  }).$extends({
  query: {
    user: {
      async create({ args, query }) {
        return query(passwordSanitizeOrEncrypt(args));
      },
      async update({ args, query }) {
        return query(passwordSanitizeOrEncrypt(args));
      }
    },
  },
});

function passwordSanitizeOrEncrypt(args: any) {
  if (args.data['password'] == undefined || args.data['password'] == "") {
    delete args.data['password'];
  } else {
    args.data['password'] = bcrypt.hashSync(args.data['password'] as string, 10);
  }
  return args;
}

export { prisma };
