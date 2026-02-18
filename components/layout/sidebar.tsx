"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { File, LayoutDashboard, ListChecks, LogOut, NotebookPen, Share2, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { createSupabaseBrowserClient } from "@/lib/supabase/client";

const links = [
  { href: "/dashboard", icon: LayoutDashboard, label: "Dashboard" },
  { href: "/todos", icon: ListChecks, label: "Todos" },
  { href: "/notes", icon: NotebookPen, label: "Notes" },
  { href: "/shared", icon: Share2, label: "Shared" },
  { href: "/files", icon: File, label: "Files" },
  { href: "/profile", icon: User, label: "Profile" }
];

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const supabase = createSupabaseBrowserClient();

  return (
    <aside className="flex h-full w-full flex-col border-r border-slate-200 bg-white p-4 dark:border-slate-800 dark:bg-slate-900 md:w-72">
      <h2 className="mb-6 text-xl font-semibold">NexusBoard</h2>
      <nav className="space-y-2">
        {links.map(({ href, icon: Icon, label }) => (
          <Link
            key={href}
            href={href}
            className={cn(
              "flex items-center gap-3 rounded-lg px-3 py-2 text-sm",
              pathname === href
                ? "bg-brand-500 text-white"
                : "text-slate-600 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-800"
            )}
          >
            <Icon className="h-4 w-4" />
            {label}
          </Link>
        ))}
      </nav>

      <button
        onClick={async () => {
          await supabase.auth.signOut();
          router.push("/login");
          router.refresh();
        }}
        className="btn-secondary mt-auto gap-2"
      >
        <LogOut className="h-4 w-4" />
        Sign out
      </button>
    </aside>
  );
}
