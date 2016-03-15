import Ember from 'ember';

export default Ember.Mixin.create({

  hasPermission: function(currentUser, repoId) {
    var id = parseInt(repoId);
    var permissions;
    if (permissions = this.get('currentUser.permissions')) {
      return permissions.contains(id);
    }
  },
  hasPushPermission: function(currentUser, repoId) {
    var id = parseInt(repoId);
    var permissions;
    if (permissions = this.get('currentUser.pushPermissions')) {
      return permissions.contains(id);
    }
  },
  hasAdminPermission: function(currentUser, repoId) {
    var id = parseInt(repoId);
    var permissions;
    if (permissions = this.get('currentUser.adminPermissions')) {
      return permissions.contains(id);
    }
  }
});
