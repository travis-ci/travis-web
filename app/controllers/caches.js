import Ember from 'ember';

const { service, controller } = Ember.inject;

export default Ember.Controller.extend({
  ajax: service(),
  repoController: controller('repo'),
  repo: Ember.computed.alias('repoController.repo'),
  isDeleting: false,

  cachesExist: function() {
    return this.get('model.pushes.length') || this.get('model.pullRequests.length');
  }.property('model.pushes.length', 'model.pullRequests.length'),

  actions: {
    deleteRepoCache() {
      var deletingDone, repo;
      if (this.get('isDeleting')) {
        return;
      }
      if (confirm('Are you sure?')) {
        this.set('isDeleting', true);
        deletingDone = () => {
          return this.set('isDeleting', false);
        };
        repo = this.get('repo');
        return this.get('ajax').ajax("/repos/" + (this.get('repo.id')) + "/caches", "DELETE").then(deletingDone, deletingDone).then(() => {
          return this.set('model', {});
        });
      }
    }
  }
});
