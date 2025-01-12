import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { email, password, name } = await req.json();

  // 检查邮箱是否已注册
  const existingUser = await prisma.user.findUnique({ where: { email } });
  if (existingUser) {
    return NextResponse.json(
      { message: 'Email already registered' },
      { status: 400 }
    );
  }

  // 加密密码
  const hashedPassword = bcrypt.hashSync(password, 10);

  // 创建用户
  const user = await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      name,
      avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}`, // 默认头像
    },
  });

  return NextResponse.json(
    {
      message: 'User registered successfully',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar, // 返回头像字段
      },
    },
    { status: 201 }
  );
}