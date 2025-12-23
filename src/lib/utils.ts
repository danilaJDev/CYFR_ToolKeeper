export function getString(form: FormData, key: string) {
  const value = form.get(key);
  return typeof value === "string" ? value.trim() : "";
}

export function formatDate(value?: string | null) {
  if (!value) return "";
  return new Date(value).toLocaleString();
}
