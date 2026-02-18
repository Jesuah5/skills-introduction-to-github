import Link from "next/link";

export default function HomePage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-4xl flex-col items-center justify-center px-4 text-center">
      <h1 className="text-4xl font-bold tracking-tight">NexusBoard</h1>
      <p className="mt-4 max-w-2xl text-slate-600 dark:text-slate-300">
        Production-ready collaborative workspace for todos, notes, and secure file sharing.
      </p>
      <div className="mt-8 flex gap-3">
        <Link href="/signup" className="btn-primary">Get started</Link>
        <Link href="/login" className="btn-secondary">Sign in</Link>
      </div>
    </main>
  );
}
