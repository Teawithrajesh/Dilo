// Role rules for DISPLAY only. In Phase 2 the database (Row Level Security) is the real control.
import type { Role } from "@/lib/demo/data";

const rank: Record<Role, number> = { member: 1, moderator: 2, admin: 3, owner: 4 };

export const can = {
  seeCommunity: (role: Role | null) => role !== null,
  approveMembers: (role: Role | null) => role !== null && rank[role] >= rank.moderator,
  manageRoles: (role: Role | null) => role !== null && rank[role] >= rank.admin,
  createEvent: (role: Role | null) => role !== null,
  invite: (role: Role | null) => role !== null && rank[role] >= rank.moderator,
  /** You can remove someone only if your role is higher than theirs (so nobody can remove the owner). */
  remove: (actor: Role | null, target: Role) => actor !== null && rank[actor] >= rank.moderator && rank[actor] > rank[target],
  /** Owners and admins can switch members and moderators; nobody changes an owner's role here. */
  changeRole: (actor: Role | null, target: Role) => actor !== null && rank[actor] >= rank.admin && rank[actor] > rank[target],
};

export const roleLabel: Record<Role, string> = { owner: "Owner", admin: "Admin", moderator: "Moderator", member: "Member" };
