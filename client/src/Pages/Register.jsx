import { useState } from "react";
import { Link, useNavigate } from "@tanstack/react-router";
import toast from "react-hot-toast";
import api from "../services/api";

export default function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate(); // navigate hook

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    // Toast Loading 
    const toastId = toast.loading("Creating your account...");

    try {
      const response = await api.post("/auth/register", {
        name,
        email,
        password,
      });

      toast.success(response.data.message || "Registration successful!", {
        id: toastId,
      });
      navigate({ to: "/login" });
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Something went wrong!";
      toast.error(errorMessage, { id: toastId });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md p-8 bg-white rounded-xl shadow-lg border border-gray-100">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900">
            Create an Account
          </h2>
          <p className="text-gray-500 mt-2">
            Join us to create and share live polls.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Name Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200"
              placeholder="John Doe"
            />
          </div>

          {/* Email Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email address
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200"
              placeholder="john@example.com"
            />
          </div>

          {/* Password Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              required
              minLength="8"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all duration-200"
              placeholder="••••••••"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 bg-primary hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg shadow-md transition-all duration-200"
          >
            {loading ? "Signing up..." : "Sign Up"}
          </button>
        </form>

        <p className="text-center text-gray-600 mt-6">
          Already have an account?{" "}
          <Link
            to="/login"
            className="text-primary font-semibold hover:underline"
          >
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
