import { getRoleName } from "@/utils/getRoleName";
import { permissionsList } from "./permissions";

export function permissionsByRoleName() {
  const role = getRoleName();
  const rolePermissions = permissionsList[role];

  return rolePermissions;
}
