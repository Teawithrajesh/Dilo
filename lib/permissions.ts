// Role rules for DISPLAY only. In Phase 2 the database (Row Level Security) is the real control.
import type { Role } from "@/lib/demo/data";

const rank: Record<Role, number> = { member: 1, moderator: 2, admin: 3, owner: 4 };

export const can = {
  seeCommunity: (role: Role | null) => role !== null,
  approveMembers: (role: Role | null) => role !== null && rank[role] >= rank.moderator,
  manageRoles: (role: Role | null) => role !== null && rank[role] >= rank.admin,
  createEvent: (role: Role | null) => role !== null,
};

export const roleLabel: Record<Role, string> = { owner: "Owner", admin: "Admin", moderator: "Moderator", member: "Member" };
