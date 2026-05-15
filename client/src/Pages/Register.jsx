import { Link, useNavigate } from "@tanstack/react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import toast from "react-hot-toast";
import api from "../services/api";
import { User, Mail, Lock } from "lucide-react";

const registerSchema = z.object({
  name: z.string().min(3, "Name must be at least 3 characters"),
  email: z.string().email("Please enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(
      /(?=.*[A-Z])(?=.*\d)/,
      "Must contain at least one uppercase letter and one digit"
    ),
});

export default function Register() {
  const navigate = useNavigate();
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm({ resolver: zodResolver(registerSchema) });

  const onSubmit = async (data) => {
    const toastId = toast.loading("Creating your account...");
    try {
      const response = await api.post("/auth/register", data);
      toast.success(response.data.message || "Registration successful!", {
        id: toastId,
      });
      reset();
      navigate({ to: "/login" });
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong!", {
        id: toastId,
      });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[80vh] animate-fade-in">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-card-dark rounded-2xl shadow-xl border border-border dark:border-border-dark overflow-hidden">
          <div className="h-1 bg-gradient-to-r from-primary via-primary-light to-accent" />
          <div className="p-8">
            <div className="text-center mb-8">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-4 shadow-lg shadow-primary/20">
                <User size={24} className="text-white" />
              </div>
              <h2 className="text-2xl font-bold text-heading dark:text-white">
                Create an Account
              </h2>
              <p className="text-body dark:text-muted mt-1">
                Join us to create and share live polls.
              </p>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              {/* Name */}
              <div>
                <label className="block text-sm font-medium text-heading dark:text-slate-300 mb-1.5">
                  Full Name
                </label>
                <div className="relative">
                  <User
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                  />
                  <input
                    {...register("name")}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-transparent dark:text-white outline-none transition-all ${
                      errors.name
                        ? "border-error"
                        : "border-border dark:border-border-dark focus:border-primary focus:ring-2 focus:ring-primary/20"
                    }`}
                    placeholder="John Doe"
                  />
                </div>
                {errors.name && (
                  <p className="text-error text-xs mt-1">
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-heading dark:text-slate-300 mb-1.5">
                  Email address
                </label>
                <div className="relative">
                  <Mail
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                  />
                  <input
                    {...register("email")}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-transparent dark:text-white outline-none transition-all ${
                      errors.email
                        ? "border-error"
                        : "border-border dark:border-border-dark focus:border-primary focus:ring-2 focus:ring-primary/20"
                    }`}
                    placeholder="john@example.com"
                  />
                </div>
                {errors.email && (
                  <p className="text-error text-xs mt-1">
                    {errors.email.message}
                  </p>
                )}
              </div>

              {/* Password */}
              <div>
                <label className="block text-sm font-medium text-heading dark:text-slate-300 mb-1.5">
                  Password
                </label>
                <div className="relative">
                  <Lock
                    size={16}
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-muted"
                  />
                  <input
                    type="password"
                    {...register("password")}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-transparent dark:text-white outline-none transition-all ${
                      errors.password
                        ? "border-error"
                        : "border-border dark:border-border-dark focus:border-primary focus:ring-2 focus:ring-primary/20"
                    }`}
                    placeholder="••••••••"
                  />
                </div>
                {errors.password && (
                  <p className="text-error text-xs mt-1">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3 rounded-xl text-white font-semibold bg-gradient-to-r from-primary to-primary-light hover:from-primary-dark hover:to-primary disabled:opacity-50 shadow-lg shadow-primary/25 hover:shadow-xl transform hover:-translate-y-0.5 transition-all duration-300"
              >
                {isSubmitting ? "Signing up..." : "Sign Up"}
              </button>
            </form>

            <p className="text-center text-body dark:text-muted mt-6">
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
      </div>
    </div>
  );
}
