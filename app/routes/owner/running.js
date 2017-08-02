import Ember from 'ember';

export default Ember.Route.extend({

  model(params, transition) {
    return this.store.query('build', { active: true, owner: 'travis-ci' });
  }
});
