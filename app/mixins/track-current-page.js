import Ember from 'ember';

// Taken from https://github.com/poteto/ember-metrics/issues/43#issuecomment-194690887

export default Ember.Mixin.create({
  metrics: Ember.inject.service(),
  trackCurrentPage: Ember.on('activate', function () {
    Ember.run.scheduleOnce('afterRender', this, () => {
      const page = document.location.pathname;
      const title = this.getWithDefault('routeName', 'unknown');

      Ember.get(this, 'metrics').trackPage({ page, title });
    });
  })
});
