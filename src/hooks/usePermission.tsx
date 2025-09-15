// hooks/usePermission.ts
import { useApiStore } from "@/lib/api/apiStore"; // your Zustand store
import { checkPermission } from "@/utils/pathMatch";

export const usePermission = (requiredPermission?: string): boolean => {
  const profile = useApiStore((state) => state?.profile);

  const userPermissions: string[] = profile?.role?.permissions || [];

  return checkPermission(userPermissions, requiredPermission);
};