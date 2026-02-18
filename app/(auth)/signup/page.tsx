import Link from "next/link";
import { AuthForm } from "@/components/ui/auth-form";

export default function SignupPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4">
      <div className="space-y-4">
        <AuthForm mode="signup" />
        <p className="text-center text-sm text-slate-600 dark:text-slate-300">
          Already have an account? <Link href="/login" className="text-brand-500">Sign in</Link>
        </p>
      </div>
    </main>
  );
}
