'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { useEffect, useState } from 'react';
import Image from 'next/image';

export default function Navbar() {
  const pathname = usePathname(); // 获取当前路由路径
  const { user, isAuthenticated } = useAuthStore(); // 从 Zustand Store 获取用户信息
  const [isClient, setIsClient] = useState(false); // 标记是否在客户端

  // 导航项列表
  const navItems = [
    { href: '/templates', label: '模板中心' },
    { href: '/collaboration', label: '协作空间' },
    { href: '/ai', label: 'AI 助手' },
    { href: '/profile', label: '个人空间' },
  ];

  // 在 useEffect 中标记客户端渲染完成
  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          <Link href="/" className="text-2xl font-bold text-blue-600">
            NoCodeX
          </Link>
          <div className="flex items-center space-x-4">
            {/* 导航项 */}
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`text-gray-700 hover:text-blue-600 ${
                  pathname === item.href ? 'font-bold text-blue-600' : ''
                }`}
              >
                {item.label}
              </Link>
            ))}

            {/* 登录状态显示 */}
            {isClient && ( // 只在客户端渲染登录状态
              <>
                {isAuthenticated && user ? (
                  <div className="flex items-center space-x-2">
                    <Image
                      width={32}
                      height={32}
                      src={`http://localhost:3000/${user.avatar}` || 'http://localhost:3000/uploads/2.jpg'}
                      alt="用户头像"
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-gray-700">你好，{user.name}！</span>
                  </div>
                ) : (
                  <Link href="/login" className="text-gray-700 hover:text-blue-600">
                    登录
                  </Link>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}