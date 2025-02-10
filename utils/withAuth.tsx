'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { ComponentType } from 'react';
import Modal from '@/components/Modal'; // 引入自定义 Modal 组件

// 定义高阶组件的 Props 类型
type WithAuthProps = {
  // 可以在这里定义需要传递给包裹组件的额外 props
};

// 高阶组件函数
export const withAuth = <P extends WithAuthProps>(
  WrappedComponent: ComponentType<P>
) => {
  // 返回的组件
  const AuthComponent = (props: P) => {
    const router = useRouter();
    const { isAuthenticated } = useAuthStore();
    const [isModalOpen, setIsModalOpen] = useState(false); // 控制 Modal 显示
    const [hydrated, setHydrated] = useState(false); // 用于判断是否已经完成客户端渲染

    // 获取当前路径
    const currentPath = router.asPath;

    useEffect(() => {
      // Hydration完成后，更新hydrated状态
      setHydrated(true);
    }, []);

    useEffect(() => {
      // 如果未认证且不是首页，弹出登录 Modal
      if (hydrated && !isAuthenticated && currentPath !== '/') {
        setIsModalOpen(true);
      }
    }, [isAuthenticated, currentPath, hydrated]);

    const handleConfirm = () => {
      router.push('/login'); // 用户点击“确定”后跳转到登录页
      setIsModalOpen(false); // 关闭 Modal
    };

    const handleCancel = () => {
      router.push('/'); // 用户点击“取消”后返回首页
      setIsModalOpen(false); // 关闭 Modal
    };

    // 如果未认证且不是首页，显示 Modal
    if (!hydrated || (!isAuthenticated && currentPath !== '/')) {
      return (
        <Modal
          isOpen={isModalOpen}
          onClose={handleCancel}
          onConfirm={handleConfirm}
          title="请先登录"
          message="是否跳转到登录页？"
        />
      );
    }

    // 渲染包裹的组件
    return <WrappedComponent {...props} />;
  };

  // 设置显示名称，方便调试
  AuthComponent.displayName = `withAuth(${
    WrappedComponent.displayName || WrappedComponent.name || 'Component'
  })`;

  return AuthComponent;
};
