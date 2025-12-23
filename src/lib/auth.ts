import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { OrganizationMember, Profile, Role } from "@/lib/types";

export async function requireUser() {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profileRow } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const profile = (profileRow ?? null) as Profile | null;

  return { user, profile } as { user: typeof user; profile: Profile | null };
}

export async function requireOrgAccess(options?: { roles?: Role[] }) {
  const supabase = await createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profileRow } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const profile = (profileRow ?? null) as Profile | null;
  const organizationId = profile?.default_organization_id ?? "";

  const { data: membershipRow } = await supabase
    .from("organization_members")
    .select("*")
    .eq("user_id", user.id)
    .eq("organization_id", organizationId)
    .single();

  const member = (membershipRow ?? null) as OrganizationMember | null;

  if (!member) {
    redirect("/register?error=org");
  }

  if (options?.roles && !options.roles.includes(member.role)) {
    redirect("/dashboard?error=forbidden");
  }

  return { user, profile, membership: member, organizationId: member.organization_id } as {
    user: typeof user;
    profile: Profile | null;
    membership: OrganizationMember;
    organizationId: string;
  };
}
