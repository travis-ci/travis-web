
var hasPermission = function(user, repoId) {
  var id = parseInt(repoId);
  var permissions;
  if (user) {
    if (permissions = user.get('permissions')) {
      return permissions.contains(id);
    }
  }
};

var hasPushPermission = function(user, repoId) {
  var id = parseInt(repoId);
  var permissions;
  if (user) {
    if (permissions = user.get('pushPermissions')) {
      return permissions.contains(id);
    }
  }
};

var hasAdminPermission = function(user, repoId) {
  var id = parseInt(repoId);
  var permissions;
  if (user) {
    if (permissions = user.get('adminPermissions')) {
      return permissions.contains(id);
    }
  }
};

export {hasPermission, hasPushPermission, hasAdminPermission};
