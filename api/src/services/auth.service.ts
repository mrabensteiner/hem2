import {prisma} from "../../lib/prisma";
import jwt from 'jsonwebtoken';
//import bcrypt from 'bcrypt';

const JWT_SECRET = process.env.JWT_SECRET || 'super-secure-secret-key';

export const authService = {
  async login(username: string, password: string) {
    const user = await prisma.user.findUnique({
      where: { username }
    });
    if (!user) {
      throw new Error('Wrong username or password.');
    }

    const isMatch = password == user.password;//await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Wrong useranme or password.');
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET, { expiresIn: '1d' });

    return {
      token,
      user: {
        id: user.id,
        firstname: user.firstname,
        lastname: user.lastname,
        username: user.username,
      }
    };
  }
};
