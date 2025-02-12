import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';

const prisma = new PrismaClient();

export async function POST(req: Request) {
  const { id, newPassword } = await req.json();
  // 验证输入
  if (!id || !newPassword) {
    return NextResponse.json(
      { message: '用户ID和新密码不能为空' },
      { status: 400 }
    );
  }

  try {
    // 查找用户
    const user = await prisma.user.findUnique({ where: { id: id } });
    if (!user) {
      return NextResponse.json(
        { message: '用户不存在' },
        { status: 404 }
      );
    }

    // 加密新密码
    const hashedPassword = bcrypt.hashSync(newPassword, 10);

    // 更新用户密码
    await prisma.user.update({
      where: { id: id },
      data: { password: hashedPassword },
    });

    return NextResponse.json(
      { message: '密码修改成功' },
      { status: 200 }
    );
  } catch (error) {
    console.error('修改密码失败:', error);
    return NextResponse.json(
      { message: '修改密码失败，请稍后重试' },
      { status: 500 }
    );
  }
}