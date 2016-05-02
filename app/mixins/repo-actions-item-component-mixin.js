import Ember from 'ember';
import eventually from 'travis/utils/eventually';

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

  displayFlashError(status, action) {
    let type = this.get('type');
    if (status === 422 || status === 400) {
      let actionTerm = action === 'restart' ? 'restarted' : 'canceled';
      this.get('flashes').error(`This ${type} can't be ${actionTerm}`);
    } else if (status === 403) {
      let actionTerm = action === 'restart' ? 'restart' : 'cancel';
      this.get('flashes').error(`You don't have sufficient access to ${actionTerm} this ${type}`);
    } else {
      let actionTerm = action === 'restart' ? 'restarting' : 'canceling';
      this.get('flashes').error(`An error occured when ${actionTerm} the ${type}`);
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
        this.displayFlashError(xhr.status, 'restart');
      };
      eventually(this.get('item'), record => record.restart().then(onSuccess, onError) );
    },

    cancel: function() {
      var type;
      if (this.get('cancelling')) {
        return;
      }
      this.set('cancelling', true);

      type = this.get('type');
      eventually(this.get('item'), (record) => {
        record.cancel().then(() => {
          this.set('cancelling', false);
          this.get('flashes').notice(`${type.capitalize()} has been successfully cancelled.`);
        }, (xhr) => {
          this.set('cancelling', false);
          this.displayFlashError(xhr.status, 'cancel');
        });
      });
    }
  }
});
