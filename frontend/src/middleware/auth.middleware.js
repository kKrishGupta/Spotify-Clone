export function canAccessRoute(user, routeRoles = []) {
  if (!routeRoles.length) {
    return true;
  }

  return Boolean(user && routeRoles.includes(user.role));
}
