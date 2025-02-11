import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // 查找用户
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    return NextResponse.json(
      { message: '邮箱或密码无效' },
      { status: 400 }
    );
  }

  // 验证密码
  const isValidPassword = bcrypt.compareSync(password, user.password);
  if (!isValidPassword) {
    return NextResponse.json(
      { message: '邮箱或密码无效' },
      { status: 400 }
    );
  }

  // 生成 JWT
  const token = jwt.sign({ userId: user.id }, process.env.JWT_SECRET!, {
    expiresIn: '1h',
  });

  // 返回用户信息和 token
  return NextResponse.json(
    {
      message: '登录成功',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        pwd: user.password,
      },
    },
    { status: 200 }
  );
}