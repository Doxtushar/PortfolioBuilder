export const createUsernameBase = (name: string, email: string): string => {
  const emailLocalPart = email.split("@")[0] ?? "";
  const source = name.trim() || emailLocalPart || "user";
  const normalized = source
    .toLowerCase()
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 50)
    .replace(/-+$/g, "");

  return normalized || "user";
};

export const createUsernameCandidate = (base: string, attempt: number): string => {
  if (attempt === 0) {
    return base.slice(0, 50);
  }

  const suffix = `-${attempt + 1}`;
  return `${base.slice(0, 50 - suffix.length)}${suffix}`;
};
