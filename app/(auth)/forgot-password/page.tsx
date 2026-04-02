import ForgotPasswordForm from "@/app/(auth)/components/ForgotPasswordForm";
import Link from "next/link";

export default function ForgotPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        {/* TITLE */}
        <h1 className="text-2xl font-semibold text-gray-800 text-center">
          Forgot Password?
        </h1>
        <p className="text-sm text-gray-500 text-center mt-1">
          Enter your email and we’ll send you a reset link
        </p>

        {/* FORM */}
        <div className="mt-6">
          <ForgotPasswordForm />
        </div>

        {/* BACK TO LOGIN */}
        <p className="text-center mt-6 text-sm text-gray-600">
          Remember your password?{" "}
          <Link
            href="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
