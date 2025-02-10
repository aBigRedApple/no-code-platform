import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center h-full bg-gray-100">
      <h1 className="text-6xl font-bold text-red-500">404</h1>
      <p className="text-2xl font-semibold text-gray-600 mt-4">页面未找到</p>
      <p className="text-gray-500 mt-2">抱歉，您访问的页面不存在。</p>
      <Link
        href="/"
        className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600 mt-8"
      >
        返回首页
      </Link>
    </div>
  );
}