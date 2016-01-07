import Ember from 'ember';

export default Ember.Mixin.create({
  restarting: false,
  cancelling: false,

  userHasPermissionForRepo: function() {
    var repo, user;
    repo = this.get('repo');
    user = this.get('user');
    if (user && repo) {
      return user.hasAccessToRepo(repo);
    }
  }.property('user.permissions.[]', 'repo', 'user'),

  canCancel: function() {
    return this.get('item.canCancel') && this.get('userHasPermissionForRepo');
  }.property('userHasPermissionForRepo', 'item.canCancel'),

  canRestart: function() {
    return this.get('item.canRestart') && this.get('userHasPermissionForRepo');
  }.property('userHasPermissionForRepo', 'item.canRestart'),

  actions: {
    restart: function() {
      var onFinished;
      if (this.get('restarting')) {
        return;
      }
      this.set('restarting', true);
      onFinished = () => {
        this.set('restarting', false);
      };
      return this.get('item').restart().then(onFinished, onFinished);
    },
    cancel: function() {
      var type;
      if (this.get('cancelling')) {
        return;
      }
      this.set('cancelling', true);

      type = this.get('type');
      return this.get('item').cancel().then(() => {
        this.set('cancelling', false);
        return Travis.flash({
          success: (type.capitalize()) + " has been successfully canceled."
        });
      }, (xhr) => {
        this.set('cancelling', false);
        if (xhr.status === 422) {
          return Travis.flash({
            error: "This " + type + " can't be canceled"
          });
        } else if (xhr.status === 403) {
          return Travis.flash({
            error: "You don't have sufficient access to cancel this " + type
          });
        } else {
          return Travis.flash({
            error: "An error occured when canceling the " + type
          });
        }
      });
    }
  }
});
