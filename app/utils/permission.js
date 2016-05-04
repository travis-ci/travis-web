
var hasPermission = function(user, repo) {
  let id = isNaN(repo) ? repo.get('id') : parseInt(repo);
  if(user) {
    return user.get('permissions').contains(id);
  }
};

var hasPushPermission = function(user, repo) {
  let id = isNaN(repo) ? repo.get('id') : parseInt(repo);
  if(user) {
    return user.get('pushPermissions').contains(id);
  }
};

var hasAdminPermission = function(user, repo) {
  let id = isNaN(repo) ? repo.get('id') : parseInt(repo);
  if(user) {
    return user.get('adminPermissions').contains(id);
  }
};

export {hasPermission, hasPushPermission, hasAdminPermission};
