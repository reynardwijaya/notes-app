import ResetPasswordForm from "@/app/components/auth/ResetPasswordForm";
import Link from "next/link";

export default function ResetPasswordPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        <h1 className="text-2xl font-semibold text-gray-800 text-center">
          Reset password
        </h1>
        <p className="text-sm text-gray-500 text-center mt-1">
          Choose a new password for your account
        </p>

        <div className="mt-6">
          <ResetPasswordForm />
        </div>

        <p className="text-center mt-6 text-sm text-gray-600">
          Back to{" "}
          <Link
            href="/auth/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}

