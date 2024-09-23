export function getRoleName() {
  const roleName = JSON.parse(
    localStorage.getItem("role") ? localStorage.getItem("role") : null
  )?.title;
  return roleName;
}
