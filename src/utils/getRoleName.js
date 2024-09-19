export function getRoleName() {
  const roleName = JSON.parse(localStorage.getItem("role"))?.title;
  return roleName;
}
