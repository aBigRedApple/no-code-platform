"use client";

import { useState, useEffect } from "react";
import { UploadOutlined } from "@ant-design/icons";
import Cookies from "js-cookie"; // 引入 js-cookie
import { updateUserProfile } from "@/services/authService";

type User = {
  id: number;
  email: string;
  name: string;
  avatar: string;
};

type EditProfileModalProps = {
  isOpen: boolean;
  onClose: () => void;
  user: User;
  onSave: (updatedUser: Partial<User>) => void; // 修改为传递更新后的用户信息
};

const EditProfileModal = (props: EditProfileModalProps) => {
  const { isOpen, onClose, user, onSave } = props;
  const [name, setName] = useState(user.name);
  const [avatarFile, setAvatarFile] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(user.avatar || null);
  const [isLoading, setIsLoading] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null); // 用于保存文件验证错误信息
  const [isFileUploaded, setIsFileUploaded] = useState(false); // 标志是否上传了文件

  // 从 cookies 中获取用户信息
  useEffect(() => {
    const storedUser = Cookies.get("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setName(parsedUser.name);
      setAvatarPreview(parsedUser.avatar || user.avatar); // 确保如果没有新头像，则使用当前头像
    }
  }, [isOpen]); // 每次打开模态框时重新加载

  // 处理文件选择和验证
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setIsFileUploaded(true); // 标记已上传文件
      // 验证文件类型
      const allowedMimeTypes = ["image/jpeg", "image/png", "image/gif"];
      if (!allowedMimeTypes.includes(file.type)) {
        setFileError("只允许上传 JPEG、PNG 或 GIF 格式的图片");
        setAvatarFile(null); // 清除文件选择
        setAvatarPreview(null); // 清除预览
        return;
      }

      // 验证文件大小（最大 2MB）
      if (file.size > 2 * 1024 * 1024) {
        setFileError("文件大小不能超过 2MB");
        setAvatarFile(null); // 清除文件选择
        setAvatarPreview(null); // 清除预览
        return;
      }

      // 如果验证通过，设置头像文件和预览
      setFileError(null); // 清除错误信息
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file)); // 生成预览 URL
    }
  };

  // 处理表单提交
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isLoading) return;

    try {
      setIsLoading(true);

      const formData = new FormData();
      formData.append("id", user.id.toString()); // 添加用户 ID
      formData.append("name", name);

      if (avatarFile) {
        formData.append("avatar", avatarFile); // 添加头像文件
      }

      const response = await updateUserProfile(formData);
      if (response.status === 200) {
        // 假设后端返回的响应中包含新的用户信息
        const updatedUser = {
          id: user.id,
          email: user.email, // 保持 email 不变
          name: name,
          avatar: response.data.user.avatar || user.avatar, // 使用后端返回的新头像路径或旧头像
        };

        // 更新 cookies 中的用户信息
        Cookies.set("user", JSON.stringify(updatedUser));
        // 通知父组件刷新数据，并传递更新后的用户信息
        onSave(updatedUser);
        onClose(); // 关闭模态框
        alert("更新成功");
      } else {
        alert("更新失败，请重试");
      }
    } catch (error) {
      console.error("更新失败:", error);
      alert("更新失败，请重试");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h2 className="text-2xl font-semibold text-gray-900 mb-6">修改个人信息</h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 头像部分 */}
          <div className="text-center mb-6">
            <label htmlFor="avatar-upload" className="cursor-pointer inline-block">
              <div className="relative">
                <div className="w-24 h-24 rounded-full mx-auto mb-4 border-4 border-blue-600 shadow-md">
                  {avatarPreview ? (
                    <img src={avatarPreview} alt="用户头像" className="w-full h-full rounded-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full">
                      <UploadOutlined className="text-blue-600 text-4xl" />
                    </div>
                  )}
                </div>
                <div className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-1">
                  <UploadOutlined className="text-white" />
                </div>
              </div>
              <span className="text-blue-600 text-sm block">点击更换头像</span>
            </label>
            <input id="avatar-upload" type="file" accept="image/*" onChange={handleFileChange} className="hidden" />
          </div>
          {fileError && <p className="text-red-600 text-sm">{fileError}</p>} {/* 显示文件验证错误信息 */}
          {/* 姓名输入框 */}
          <div>
            <label className="block text-sm font-medium text-gray-700">姓名</label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
          </div>
          {/* 操作按钮 */}
          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-gray-600"
            >
              取消
            </button>
            <button
              type="submit"
              disabled={isLoading || (isFileUploaded && fileError !== null)}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-600 disabled:opacity-50"
            >
              {isLoading ? "保存中..." : "保存"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditProfileModal;
