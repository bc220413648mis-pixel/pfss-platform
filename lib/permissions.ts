import { Role } from "@prisma/client";

export const PERMISSIONS = {
  CAN_SCAN: [Role.FOUNDER, Role.AUDITOR],
  CAN_LOG_ISSUE: [Role.FOUNDER, Role.AUDITOR],
  CAN_EDIT_STATUS: [Role.FOUNDER, Role.AUDITOR, Role.QA_ADMIN],
  CAN_VIEW_REPORT: [Role.FOUNDER, Role.AUDITOR, Role.QA_ADMIN, Role.CLIENT],
  CAN_START_REVIEW: [Role.FOUNDER, Role.AUDITOR],
} as const;

export function hasPermission(role: Role, action: keyof typeof PERMISSIONS): boolean {
  // This explicitly tells TypeScript that the role exists in the allowed list
  const allowedRoles = PERMISSIONS[action] as readonly Role[];
  return allowedRoles.includes(role);
}