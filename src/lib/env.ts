const ensureEnv = (name: string, value: string | undefined): string => {
    if (!value) {
        throw new Error(`Missing environment variable: ${name}`);
    }
    return value;
};

export const env = {
    NEXT_PUBLIC_SUPABASE_URL: ensureEnv(
        "NEXT_PUBLIC_SUPABASE_URL",
        process.env.NEXT_PUBLIC_SUPABASE_URL),

    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: ensureEnv(
        "NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY",
        process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY,
    ),

    NEXT_PUBLIC_SITE_URL: ensureEnv(
        "NEXT_PUBLIC_SITE_URL",
        process.env.NEXT_PUBLIC_SITE_URL,
    ),
};