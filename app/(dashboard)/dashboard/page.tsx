import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function DashboardPage() {
  const supabase = await createSupabaseServerClient();
  const [{ count: todoCount }, { count: noteCount }, { count: sharedCount }] = await Promise.all([
    supabase.from("todos").select("id", { count: "exact", head: true }),
    supabase.from("notes").select("id", { count: "exact", head: true }),
    supabase.from("shares").select("id", { count: "exact", head: true })
  ]);

  return (
    <section className="grid gap-4 md:grid-cols-3">
      <article className="card"><p className="text-sm text-slate-500">Todos</p><p className="text-3xl font-semibold">{todoCount ?? 0}</p></article>
      <article className="card"><p className="text-sm text-slate-500">Notes</p><p className="text-3xl font-semibold">{noteCount ?? 0}</p></article>
      <article className="card"><p className="text-sm text-slate-500">Shared records</p><p className="text-3xl font-semibold">{sharedCount ?? 0}</p></article>
    </section>
  );
}
