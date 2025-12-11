// Re-export Role from Prisma for backward compatibility
import { Role } from "@prisma/client";
export { Role };

export const RoleHierarchy = {
  [Role.USER]: 1,
  [Role.MANAGER]: 2,
  [Role.ADMIN]: 3,
};
