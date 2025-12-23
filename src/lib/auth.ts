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

  const { data: membershipList } = await supabase
    .from("organization_members")
    .select("*")
    .eq("user_id", user.id)
    .returns<OrganizationMember[]>();
  const memberships = (membershipList ?? []) as OrganizationMember[];

  let organizationId =
    profile?.default_organization_id ||
    profile?.organization_id ||
    profile?.org_id ||
    memberships?.[0]?.organization_id ||
    "";

  let member = memberships.find((m) => m.organization_id === organizationId) as
    | OrganizationMember
    | undefined;

  if (!member && organizationId) {
    const { data: insertedMember } = await supabase
      .from("organization_members")
      .insert({
        organization_id: organizationId,
        user_id: user.id,
        role: profile?.role ?? "owner",
      })
      .select("*")
      .single();

    member = insertedMember as OrganizationMember | undefined;
  }

  if (!member) {
    redirect("/register?error=org");
  }

  organizationId = member.organization_id;

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
