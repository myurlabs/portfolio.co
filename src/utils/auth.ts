export function verifyAdminPassword(input: string) {
  const saved = localStorage.getItem("admin_password");
  // if no password stored, deny access (you can change logic to allow first-time setup)
  return saved !== null && input === saved;
}

// helper to set password (call this from admin setup if you want)
export function setAdminPassword(pwd: string) {
  localStorage.setItem("admin_password", pwd);
}
