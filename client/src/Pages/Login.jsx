// src/Pages/Login.jsx
import { Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import api from "../services/api";
import { useAuth } from "../context/AuthContext";

// 🟢 Zod Schema for Validation
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export default function Login() {
  const { login } = useAuth(); // AuthContext from login
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data) => {
    const toastId = toast.loading("Signing in...");
    try {
      const response = await api.post("/auth/login", data);

      // data save in AuthContext 
      login(response.data.data.user, response.data.data.accessToken);

      toast.success("Welcome back!", { id: toastId });
      reset(); // reset the form
      navigate({ to: "/" }); 
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "Invalid credentials!";
      toast.error(errorMessage, { id: toastId });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh]">
      <div className="w-full max-w-md p-8 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 transition-colors">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            Welcome back
          </h2>
          <p className="text-gray-500 dark:text-gray-400 mt-2">
            Please enter your details to sign in.
          </p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Email address
            </label>
            <input
              {...register("email")}
              className={`w-full px-4 py-3 rounded-lg border bg-transparent dark:text-white outline-none transition-all ${
                errors.email
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-primary"
              }`}
              placeholder="john@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">
                {errors.email.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Password
            </label>
            <input
              type="password"
              {...register("password")}
              className={`w-full px-4 py-3 rounded-lg border bg-transparent dark:text-white outline-none transition-all ${
                errors.password
                  ? "border-red-500 focus:ring-red-500"
                  : "border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-primary focus:border-primary"
              }`}
              placeholder="••••••••"
            />
            {errors.password && (
              <p className="text-red-500 text-xs mt-1">
                {errors.password.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3 px-4 bg-primary hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold rounded-lg shadow-md transition-all"
          >
            {isSubmitting ? "Signing in..." : "Sign In"}
          </button>
        </form>

        <p className="text-center text-gray-600 dark:text-gray-400 mt-6">
          Don't have an account?{" "}
          <Link
            to="/register"
            className="text-primary font-semibold hover:underline"
          >
            Sign up
          </Link>
        </p>
      </div>
    </div>
  );
}
