"use client";

import { useState, useEffect } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Cookies from "js-cookie";
import bcrypt from "bcryptjs"; // 引入 bcryptjs 用于密码验证
import { useRouter } from "next/navigation"; // 导入 useRouter

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
  onChangePassword: (userId: number, newPassword: string) => Promise<void>;
}

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
  onChangePassword,
}) => {
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");
  const [oldPassword, setOldPassword] = useState<string>(""); // 旧密码状态
  const [error, setError] = useState<string>("");
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState<boolean>(false);
  const [showOldPassword, setShowOldPassword] = useState<boolean>(false); // 旧密码显示状态
  const router = useRouter(); // 使用 useRouter

  useEffect(() => {
    if (isOpen) {
      setNewPassword("");
      setConfirmPassword("");
      setOldPassword(""); // 重置旧密码
      setError("");
      setShowNewPassword(false);
      setShowConfirmPassword(false);
      setShowOldPassword(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!oldPassword) {
      setError("请输入旧密码");
      return;
    }

    if (newPassword.length < 6) {
      setError("密码长度不能小于6");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("新密码和确认密码不匹配");
      return;
    }

    if (oldPassword === newPassword) {
      setError("新密码不能与旧密码一致");
      return;
    }

    const user = JSON.parse(Cookies.get("user") || "null");
    if (!user || !user.id || !user.pwd) {
      setError("用户信息无效，请重新登录");
      return;
    }

    const isPasswordValid = bcrypt.compareSync(oldPassword, user.pwd);
    if (!isPasswordValid) {
      setError("旧密码不正确，请重新输入");
      return;
    }

    try {
      await onChangePassword(user.id, newPassword);
      onClose();
      router.push("/login"); // 跳转到登录页
    } catch (error) {
      setError("修改密码失败，请稍后重试");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-xl font-semibold mb-4">修改密码</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 relative">
            <label className="block text-gray-700">旧密码</label>
            <input
              type={showOldPassword ? "text" : "password"}
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
            <button
              type="button"
              onClick={() => setShowOldPassword(!showOldPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-6"
            >
              {showOldPassword ? (
                <FaEye className="h-5 w-5 text-gray-500" />
              ) : (
                <FaEyeSlash className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
          <div className="mb-4 relative">
            <label className="block text-gray-700">新密码</label>
            <input
              type={showNewPassword ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-6"
            >
              {showNewPassword ? (
                <FaEye className="h-5 w-5 text-gray-500" />
              ) : (
                <FaEyeSlash className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
          <div className="mb-4 relative">
            <label className="block text-gray-700">确认新密码</label>
            <input
              type={showConfirmPassword ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-600"
              required
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 mt-6"
            >
              {showConfirmPassword ? (
                <FaEye className="h-5 w-5 text-gray-500" />
              ) : (
                <FaEyeSlash className="h-5 w-5 text-gray-500" />
              )}
            </button>
          </div>
          {error && <p className="text-red-500 mb-4">{error}</p>}
          <div className="flex justify-end">
            <button type="button" onClick={onClose} className="mr-2 px-4 py-2 text-gray-600 hover:text-gray-800">
              取消
            </button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
              保存
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChangePasswordModal;