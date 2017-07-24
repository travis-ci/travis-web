import Ember from 'ember';
import computed from 'ember-computed-decorators';

const { service } = Ember.inject;

export default Ember.Component.extend({
  tabStates: service(),

  @computed('viewingOwned')
  noReposMessage(tab) {
    if (tab === 'owned') {
      return 'You don\'t have any repos set up on Travis CI';
    } else {
      return 'No repositories found';
    }
  },
});
