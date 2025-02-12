import { PrismaClient } from '@prisma/client';
import { NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises'; // 使用 Promise 版本的 fs

const prisma = new PrismaClient();
const uploadDir = path.join(process.cwd(), 'public/uploads');

// 确保上传目录存在
await fs.mkdir(uploadDir, { recursive: true });

export async function POST(req: Request) {
  try {
    const formData = await req.formData();
    const userId = formData.get('id') as string;
    const name = formData.get('name') as string;
    const avatarFile = formData.get('avatar') as File | null;

    // 1. 验证必填字段
    if (!userId || !name) {
      return NextResponse.json({ message: '用户 ID 和姓名为必填项' }, { status: 400 });
    }

    // 2. 验证用户是否存在
    const numericUserId = parseInt(userId);
    if (isNaN(numericUserId)) {
      return NextResponse.json({ message: '无效的用户 ID' }, { status: 400 });
    }

    const user = await prisma.user.findUnique({
      where: { id: numericUserId },
    });
    if (!user) {
      return NextResponse.json({ message: '用户不存在' }, { status: 404 });
    }

    // 3. 处理头像上传（如果有）
    let avatarPath = user.avatar;  // 默认使用现有头像
    if (avatarFile) {
      // 3.1 生成唯一文件名
      const timestamp = Date.now();
      const fileExtension = avatarFile.name.split('.').pop();
      const fileName = `avatar_${numericUserId}_${timestamp}.${fileExtension}`;
      const filePath = path.join(uploadDir, fileName);

      // 3.2 保存文件
      const buffer = Buffer.from(await avatarFile.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      avatarPath = `uploads/${fileName}`; // 设置为上传后的文件路径
    }

    // 4. 更新用户数据
    const updatedUser = await prisma.user.update({
      where: { id: numericUserId },
      data: {
        name,
        avatar: avatarPath,
      },
    });

    return NextResponse.json({ message: '更新成功', user: updatedUser }, { status: 200 });
  } catch (error) {
    console.error('[Profile Update Error]', error);
    return NextResponse.json({ message: '服务器错误，请稍后重试' }, { status: 500 });
  }
}
