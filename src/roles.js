export function canTeach(user) {
  return user?.role === "admin" || user?.role === "prof";
}

export function viewerClasseId(user) {
  if (user?.role === "eleve" || user?.role === "parent") return user.classeId || "";
  return "";
}

export function viewerEleveId(user) {
  if (user?.role === "eleve") return user.id;
  if (user?.role === "parent") return user.enfantId || "";
  return "";
}

export const ROLE_LABELS = {
  admin: "Proviseur",
  prof: "Professeur",
  parent: "Parent",
  eleve: "Élève",
};
