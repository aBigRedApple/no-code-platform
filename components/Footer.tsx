// components/Footer.tsx
'use client'; // 标记为客户端组件

import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="bg-white py-10 mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <p className="text-gray-600">© 2025 NoCodeX. 保留所有权利.</p>
        <div className="mt-4 flex justify-center space-x-4">
          <Link href="/about" className="text-gray-600 hover:text-blue-600">
            关于我们
          </Link>
          <Link href="/privacy" className="text-gray-600 hover:text-blue-600">
            隐私政策
          </Link>
          <Link href="/terms" className="text-gray-600 hover:text-blue-600">
            服务条款
          </Link>
        </div>
      </div>
    </footer>
  );
}