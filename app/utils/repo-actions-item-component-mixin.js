import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Mixin.create({
  flashes: service(),

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

  displayFlashError(status) {
    let type = this.get('type');
    if (status === 422 || status === 400) {
      this.get('flashes').error(`This ${type} can't be cancelled`);
    } else if (status === 403) {
      this.get('flashes').error(`You don't have sufficient access to cancel this ${type}`);
    } else {
      this.get('flashes').error(`An error occured when canceling the ${type}`);
    }
  },

  actions: {
    restart: function() {
      if (this.get('restarting')) {
        return;
      }
      this.set('restarting', true);
      var onSuccess = () => {
        this.set('restarting', false);
        this.get('flashes').notice('The build was successfully restarted.');
      };

      var onError = (xhr) => {
        this.set('restarting', false);
        this.get('flashes').error('An error occurred. The build could not be restarted.');
        this.displayFlashError(xhr.status);
      };
      return this.get('item').restart().then(onSuccess, onError);
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
        this.get('flashes').notice(`${type.capitalize()} has been successfully cancelled.`);
      }, (xhr) => {
        this.set('cancelling', false);
        this.displayFlashError(xhr.status);
      });
    }
  }
});
