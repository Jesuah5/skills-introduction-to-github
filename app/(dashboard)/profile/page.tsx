import { ProfileForm } from "@/components/ui/profile-form";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const supabase = await createSupabaseServerClient();
  const { data: auth } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("full_name, avatar_url")
    .eq("id", auth.user?.id)
    .single();

  return <ProfileForm initialName={profile?.full_name ?? ""} initialAvatar={profile?.avatar_url ?? ""} />;
}
