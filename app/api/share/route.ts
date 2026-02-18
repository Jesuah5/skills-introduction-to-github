import { NextResponse } from "next/server";
import { createSupabaseRouteClient } from "@/lib/supabase/route";

export async function POST(req: Request) {
  const supabase = await createSupabaseRouteClient();
  const payload = await req.json();
  const { data: auth } = await supabase.auth.getUser();
  const { data, error } = await supabase
    .from("shares")
    .insert({ ...payload, owner_id: auth.user?.id })
    .select("*")
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}

export async function PATCH(req: Request) {
  const supabase = await createSupabaseRouteClient();
  const payload = await req.json();
  const { data: auth } = await supabase.auth.getUser();
  const { error } = await supabase.from("profiles").update(payload).eq("id", auth.user?.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ success: true });
}
