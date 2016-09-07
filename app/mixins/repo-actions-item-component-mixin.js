import Ember from 'ember';
import eventually from 'travis/utils/eventually';

const { service } = Ember.inject;
const { alias } = Ember.computed;

export default Ember.Mixin.create({
  flashes: service(),
  auth: service(),

  user: alias('auth.currentUser'),

  restarting: false,
  cancelling: false,

  userHasPermissionForRepo: Ember.computed('user.permissions.[]', 'repo', 'user', function () {
    var repo, user;
    repo = this.get('repo');
    user = this.get('user');
    if (user && repo) {
      return user.hasAccessToRepo(repo);
    }
  }),

  canCancel: Ember.computed('userHasPermissionForRepo', 'item.canCancel', function () {
    return this.get('item.canCancel') && this.get('userHasPermissionForRepo');
  }),

  canRestart: Ember.computed('userHasPermissionForRepo', 'item.canRestart', function () {
    return this.get('item.canRestart') && this.get('userHasPermissionForRepo');
  }),

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
    restart: function () {
      if (this.get('restarting')) {
        return;
      }
      this.set('restarting', true);
      let type = this.get('type');
      eventually(this.get('item'), (record) => {
        record.restart().then(() => {
          this.set('restarting', false);
          this.get('flashes').notice(`The ${type} was successfully restarted.`);
        }, (xhr) => {
          this.set('restarting', false);
          this.get('flashes').error(`An error occurred. The ${type} could not be restarted.`);
          this.displayFlashError(xhr.status, 'restart');
        });
      });
    },

    cancel: function () {
      if (this.get('cancelling')) {
        return;
      }
      this.set('cancelling', true);

      let type = this.get('type');
      eventually(this.get('item'), (record) => {
        record.cancel().then(() => {
          this.set('cancelling', false);
          this.get('flashes').notice(`${type.capitalize()} has been successfully cancelled.`);
        }, (xhr) => {
          this.set('cancelling', false);
          this.displayFlashError(xhr.status, 'cancel');
        });
      });
    },

    debugJob() {
      if (this.get('restarting')) {
        return;
      }
      this.set('restarting', true);
      let type = this.get('type');
      eventually(this.get('item'), (record) => {
        record.debug().then(() => {
          this.set('restarting', false);
          this.get('flashes').notice(`The ${type} was successfully restarted in debug mode.`);
        }, (xhr) => {
          this.set('restarting', false);
          this.get('flashes')
            .error(`An error occurred. The ${type} could not be restarted in debug mode.`);
          this.displayFlashError(xhr.status, 'debug');
        });
      });
    }
  }
});
