import type React from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/auth-context";
import { authAPI } from "../../lib/api";

interface AuthError {
  response?: {
    data?: {
      message?: string;
    };
  };
}

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const response = await authAPI.login({ email, password });
      // @ts-expect-error: Suppressing status type mismatch temporarily
      const token = response["access token"];

      login(token);
      setMessage("Login successful! Welcome back.");
      navigate("/dashboard");
    } catch (error: unknown) {
      const typedError = error as AuthError;
      setMessage(typedError.response?.data?.message || "Login failed: Invalid credentials.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background-gradient-start to-background-gradient-end flex items-center justify-center px-4 py-12">
      <div className="w-full max-w-md bg-white p-8 rounded-xl shadow-xl space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-800">EduMate</h1>
          <p className="text-sm text-gray-500">Educational Management System</p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              className="mt-1 w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-orange"
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your password"
              className="mt-1 w-full px-4 py-3 rounded-lg bg-gray-100 border border-gray-300 text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-accent-orange"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-gradient-to-r from-button-gradient-start to-button-gradient-end text-white text-sm font-medium rounded-lg shadow hover:opacity-90 transition"
          >
            {isLoading ? "Logging in..." : "Login"}
          </button>
        </form>

        {message && (
          <p className={`text-center text-sm mt-2 ${message.includes("successful") ? "text-green-500" : "text-red-500"}`}>
            {message}
          </p>
        )}

        <p className="text-center text-sm text-gray-600">
          Don’t have an account?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Register here
          </a>
        </p>
      </div>
    </div>
  );
}
