import { redirect } from "next/navigation";
import { createServerSupabaseClient } from "@/lib/supabase/server";
import type { OrganizationMember, Profile, Role } from "@/lib/types";

export async function requireUser() {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return { user, profile } as { user: typeof user; profile: Profile | null };
}

export async function requireOrgAccess(options?: { roles?: Role[] }) {
  const supabase = createServerSupabaseClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  const { data: membership } = await supabase
    .from("organization_members")
    .select("*")
    .eq("user_id", user.id)
    .eq("organization_id", profile?.default_organization_id ?? "")
    .single();

  if (!membership) {
    redirect("/register?error=org");
  }

  if (options?.roles && !options.roles.includes(membership.role)) {
    redirect("/dashboard?error=forbidden");
  }

  return { user, profile, membership, organizationId: membership.organization_id } as {
    user: typeof user;
    profile: Profile | null;
    membership: OrganizationMember;
    organizationId: string;
  };
}
