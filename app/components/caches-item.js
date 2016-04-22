import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Component.extend({
  ajax: service(),
  tagName: 'li',
  classNames: ['cache-item'],
  classNameBindings: ['cache.type'],
  isDeleting: false,

  actions: {
    "delete": function() {
      var data, deletingDone, repo;
      if (this.get('isDeleting')) {
        return;
      }
      if (confirm('Are you sure?')) {
        this.set('isDeleting', true);
        data = {
          branch: this.get('cache.branch')
        };
        deletingDone = () => {
          return this.set('isDeleting', false);
        };
        repo = this.get('repo');
        return this.get('ajax').ajax("/repos/" + (repo.get('id')) + "/caches", "DELETE", {
          data: data
        }).then(deletingDone, deletingDone).then(() => {
          return this.get('caches').removeObject(this.get('cache'));
        });
      }
    }
  }
});
