export const isActivePath = (pathname: string, href: string): boolean => {
  if (!pathname || !href) return false;

  const normalize = (str: string) => str.replace(/\/+$/, "");

  const normalizedPath = normalize(pathname);
  const normalizedHref = normalize(href);

  // If href is just '/', do exact match only
  if (normalizedHref === "") return normalizedPath === "";

  return (
    normalizedPath === normalizedHref ||
    normalizedPath.startsWith(normalizedHref + "/")
  );
};

export const checkPermission = (
  userPermissions: string[],
  requiredPermission?: string
): boolean => {
  if (!requiredPermission) return false;

  const normalizedUserPerms = userPermissions.map((p) => p.trim());

  return normalizedUserPerms.includes(requiredPermission.trim());
};
