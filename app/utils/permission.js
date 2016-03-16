
var hasPermission = function(currentUser, repoId) {
  var id = parseInt(repoId);
  var permissions;
  if (permissions = currentUser.get('permissions')) {
    return permissions.contains(id);
  }
};

var hasPushPermission = function(currentUser, repoId) {
  var id = parseInt(repoId);
  var permissions;
  if (permissions = currentUser.get('pushPermissions')) {
    return permissions.contains(id);
  }
};

var hasAdminPermission = function(currentUser, repoId) {
  var id = parseInt(repoId);
  var permissions;
  if (permissions = currentUser.get('adminPermissions')) {
    return permissions.contains(id);
  }
};

export {hasPermission, hasPushPermission, hasAdminPermission};
