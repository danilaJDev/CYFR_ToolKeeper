export const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!

export const supabaseKey =
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabaseKey) {
    throw new Error(
        "Отсутствуют переменные окружения Supabase. Установите NEXT_PUBLIC_SUPABASE_URL и NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY."
    )
}