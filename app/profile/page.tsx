"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { withAuth } from "@/utils/withAuth";
import EditProfileModal from "@/components/EditProfileModal";
import ChangePasswordModal from "@/components/ChangePasswordModal";
import { changePassword } from "@/services/authService";
import Image from "next/image";

// 通用按钮组件
const Button: React.FC<{
  text: string;
  color: string;
  onClick: () => void;
}> = ({ text, color, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full ${color} text-white px-6 py-3 rounded-md hover:bg-opacity-90 transition duration-300 focus:outline-none`}
  >
    {text}
  </button>
);

// 功能卡片组件
const FeatureCard: React.FC<{
  title: string;
  description: string;
  buttonText: string;
  buttonColor: string;
  buttonAction: () => void;
}> = ({ title, description, buttonText, buttonColor, buttonAction }) => (
  <div className="bg-white p-6 rounded-lg shadow-lg">
    <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
    <p className="mt-2 text-gray-600">{description}</p>
    <Button text={buttonText} color={buttonColor} onClick={buttonAction} />
  </div>
);

const Profile: React.FC = () => {
  const router = useRouter();
  const { user, updateUser, logout } = useAuthStore();
  const [isEditModalOpen, setIsEditModalOpen] = useState<boolean>(false);
  const [isChangePasswordModalOpen, setIsChangePasswordModalOpen] = useState<boolean>(false);

  // 保存用户信息
  const handleSaveProfile = (updatedUser: { name: string; email: string; avatar: string }) => {
    updateUser(updatedUser);
    setIsEditModalOpen(false);
  };

  // 退出登录
  const handleLogout = () => {
    if (confirm("您确定要退出登录吗？")) {
      logout();
      router.push("/");
    }
  };

  // 修改密码
  const handlePasswordChange = async (id: number, newPassword: string) => {
    try {
      await changePassword({ id, newPassword });
      alert("密码修改成功，请重新登录");
    } catch (error) {
      console.error("密码修改失败:", error);
      alert("密码修改失败，请重试");
    }
  };

  return (
    <section className="flex flex-col lg:flex-row h-full py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row w-full">
        {/* 左侧 - 用户信息 */}
        <div className="bg-white p-6 rounded-lg shadow-lg lg:w-1/4 w-full lg:mr-8 mb-8 lg:mb-0">
          <div className="text-center mb-6">
            <Image
              width={128}
              height={128}
              src={user?.avatar ? `http://localhost:3000/${user.avatar}` : '/uploads/2.jpg'}
              alt="用户头像"
              className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-blue-600"
            />
            <h3 className="text-2xl font-semibold text-gray-900">{user?.name}</h3>
            <p className="text-gray-600">{user?.email}</p>
          </div>

          <div className="mt-6">
            <Button text="修改个人信息" color="bg-blue-600" onClick={() => setIsEditModalOpen(true)} />
          </div>
          <div className="mt-4">
            <Button text="修改密码" color="bg-green-600" onClick={() => setIsChangePasswordModalOpen(true)} />
          </div>
          <div className="mt-4">
            <Button text="退出登录" color="bg-red-600" onClick={handleLogout} />
          </div>
        </div>

        {/* 右侧 - 功能卡片 */}
        <div className="flex-1 space-y-8">
          <FeatureCard
            title="项目管理"
            description="查看、编辑和分享你的项目。"
            buttonText="进入项目管理"
            buttonColor="bg-blue-600"
            buttonAction={() => console.log("进入项目管理")}
          />

          <FeatureCard
            title="模板管理"
            description="管理你创建和售卖的模板。"
            buttonText="进入模板管理"
            buttonColor="bg-green-600"
            buttonAction={() => console.log("进入模板管理")}
          />

          <FeatureCard
            title="团队管理"
            description="查看和管理你的团队成员。"
            buttonText="进入团队管理"
            buttonColor="bg-purple-600"
            buttonAction={() => console.log("进入团队管理")}
          />
        </div>
      </div>

      {/* 修改个人信息模态框 */}
      <EditProfileModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        user={user}
        onSave={handleSaveProfile}
      />

      {/* 修改密码模态框 */}
      <ChangePasswordModal
        isOpen={isChangePasswordModalOpen}
        onClose={() => setIsChangePasswordModalOpen(false)}
        onChangePassword={handlePasswordChange}
      />
    </section>
  );
};

export default withAuth(Profile);