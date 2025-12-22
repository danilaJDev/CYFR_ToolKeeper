export function mustGetEnv(name: string): string {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing environment variable: ${name}`);
    }
    return value;
}

export const env = {
    NEXT_PUBLIC_SUPABASE_URL: mustGetEnv("NEXT_PUBLIC_SUPABASE_URL"),
    NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: mustGetEnv("NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY"),
};