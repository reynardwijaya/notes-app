import RegisterForm from "@/app/(auth)/components/RegisterForm";
import Link from "next/link";

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded-2xl shadow-md">
        {/* TITLE */}
        <h1 className="text-2xl font-semibold text-gray-800 text-center">
          Join Notes App
        </h1>
        <p className="text-sm text-gray-500 text-center mt-1">
          Create your account to start managing notes
        </p>

        {/* FORM */}
        <div className="mt-6">
          <RegisterForm />
        </div>

        {/* LINK LOGIN */}
        <p className="text-center mt-6 text-sm text-gray-600">
          Already have an account?{" "}
          <Link
            href="/login"
            className="text-blue-600 font-medium hover:underline"
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
