import './globals.css';
import Navbar from '@/components/Navbar'; // 引入 Navbar 组件

export const metadata = {
  title: '无代码平台 - 轻松构建你的应用',
  description: '一个基于 Next.js 的无代码平台，通过拖拽式界面快速创建网页、应用和工作流。支持模板中心、协作空间、AI 助手和个人空间，让每个人都能轻松实现创意。',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="zh-CN" className="h-full">
      <body className="bg-gray-100 font-sans h-full flex flex-col">
        {/* 导航栏 */}
        <Navbar />

        {/* 页面内容 */}
        <main className="flex-1 overflow-y-auto">{children}</main>
      </body>
    </html>
  );
}