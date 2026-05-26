import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("customer");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(username, password, role);
      setSuccess(true);
      setTimeout(() => navigate("/login"), 2000);
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-md w-96">
        <h2 className="text-2xl font-bold mb-6 text-center text-green-600">
          建立新帳號
        </h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        {success && (
          <p className="text-green-500 text-sm mb-4">
            註冊成功！即將轉向登入頁面...
          </p>
        )}
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">用戶名</label>
            <input
              type="text"
              className="w-full p-2 border border-gray-300 rounded focus:border-green-500 outline-none"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700 mb-2">密碼</label>
            <input
              type="password"
              className="w-full p-2 border border-gray-300 rounded focus:border-green-500 outline-none"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <div className="mb-6">
            <label className="block text-gray-700 mb-2">身分</label>
            <select
              className="w-full p-2 border border-gray-300 rounded focus:border-green-500 outline-none"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="customer">一般客戶</option>
              <option value="admin">管理員</option>
            </select>
          </div>
          <button
            type="submit"
            className="w-full bg-green-600 text-white font-bold py-2 px-4 rounded hover:bg-green-700 transition"
          >
            註冊
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-gray-600">
          已有帳號？{" "}
          <Link to="/login" className="text-blue-600 hover:underline">
            按此登入
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
