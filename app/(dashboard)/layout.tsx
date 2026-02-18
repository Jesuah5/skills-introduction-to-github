import { Sidebar } from "@/components/layout/sidebar";
import { ThemeToggle } from "@/components/layout/theme-toggle";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen md:grid md:grid-cols-[18rem_1fr]">
      <Sidebar />
      <main className="p-4 md:p-8">
        <div className="mb-6 flex justify-end">
          <ThemeToggle />
        </div>
        {children}
      </main>
    </div>
  );
}
