export type ProjectRole = "owner" | "admin" | "member";

export const PERMISSIONS = {
  // Project permissions
  DELETE_PROJECT: ["owner"],
  UPDATE_PROJECT: ["owner", "admin"],
  INVITE_MEMBER: ["owner", "admin"],
  REMOVE_MEMBER: ["owner"],

  // Task permissions
  CREATE_TASK: ["owner", "admin", "member"],
  UPDATE_TASK: ["owner", "admin", "member"],
  DELETE_TASK: ["owner", "admin"],
  ASSIGN_TASK: ["owner", "admin"],
} as const;

export type Permission = keyof typeof PERMISSIONS;

export function hasPermission(
  userRole: ProjectRole,
  permission: Permission
): boolean {
  return (PERMISSIONS[permission] as readonly string[]).includes(userRole);
}

export function getUserRoleInProject(
  project: {
    owner: { _id: string } | string;
    members: { user: { _id: string } | string; role: string }[];
  },
  userId: string
): ProjectRole | null {
  // Check if owner
  const ownerId =
    typeof project.owner === "string"
      ? project.owner
      : project.owner._id.toString();

  if (ownerId === userId) return "owner";

  // Check members
  const member = project.members.find((m: { user: { _id: string } | string; role: string }) => {
    const memberId =
      typeof m.user === "string" ? m.user : m.user._id.toString();
    return memberId === userId;
  });

  if (!member) return null;
  return member.role as ProjectRole;
}