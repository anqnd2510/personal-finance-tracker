import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login as loginService } from "../services/auth.service";
import { useAuth } from "../contexts/AuthContext";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const data = await loginService({ email, password });

      login(data.accessToken, data.account);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      alert("Đăng nhập thất bại. Vui lòng kiểm tra lại thông tin.");
      console.error("Login failed:", err);
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded shadow w-80"
      >
        <h2 className="text-xl font-semibold mb-4 text-center">Đăng nhập</h2>
        <input
          type="email"
          placeholder="Email"
          className="w-full p-2 border rounded mb-3"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Mật khẩu"
          className="w-full p-2 border rounded mb-3"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600">
          Đăng nhập
        </button>
      </form>
    </div>
  );
};

export default Login;
