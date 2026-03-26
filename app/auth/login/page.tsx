import LoginForm from "@/app/components/auth/LoginForm";
import Link from "next/link";

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        {/* TITLE */}
        <h1 className="text-2xl font-semibold text-gray-800 text-center">
          Welcome back
        </h1>
        <p className="text-sm text-gray-500 text-center mt-1">
          Login to your account
        </p>

        {/* FORM */}
        <div className="mt-6">
          <LoginForm />
        </div>

        {/* LINKS */}
        <div className="mt-6 text-sm text-gray-600 text-center space-y-2">
          {/* REGISTER */}
          <p>
            Don’t have an account?{" "}
            <Link
              href="/auth/register"
              className="text-blue-600 font-medium hover:underline"
            >
              Register
            </Link>
          </p>

          {/* FORGOT PASSWORD */}
          <p>
            Forgot your password?{" "}
            <Link
              href="/auth/forgot-password"
              className="text-blue-600 font-medium hover:underline"
            >
              Reset here
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
