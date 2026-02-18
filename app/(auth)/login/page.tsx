import Link from "next/link";
import { AuthForm } from "@/components/ui/auth-form";

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="space-y-4">
        <AuthForm mode="login" />
        <p className="text-center text-sm text-slate-600 dark:text-slate-300">
          New here? <Link href="/signup" className="text-brand-500">Create an account</Link>
        </p>
      </div>
    </main>
  );
}
