let checkPermission = function(user, repo, permissionsType) {
  let id = isNaN(repo) ? repo.get('id') : repo;
  if(user) {
    return user.get(permissionsType).contains(parseInt(id));
  }
};

let hasPermission = function(user, repo) {
  return checkPermission(user, repo, 'permissions');
};

let hasPushPermission = function(user, repo) {
  return checkPermission(user, repo, 'pushPermissions');
};

let hasAdminPermission = function(user, repo) {
  return checkPermission(user, repo, 'adminPermissions');
};

export {hasPermission, hasPushPermission, hasAdminPermission};
