import Ember from 'ember';

// Taken from https://github.com/poteto/ember-metrics/issues/43#issuecomment-194690887

export default Ember.Mixin.create({
  metrics: Ember.inject.service(),
  trackCurrentPage: Ember.on('activate', function () {
    Ember.run.scheduleOnce('afterRender', this, () => {
      const page = document.location.pathname;
      const title = this.getWithDefault('routeName', 'unknown');

      const options = { page, title };

      const repo = this.modelFor('repo');

      if (repo) {
        options.account_uid = repo.get('owner');
      }

      Ember.get(this, 'metrics').trackPage(options);
    });
  })
});
