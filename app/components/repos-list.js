import Ember from 'ember';
import { computed } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';

export default Ember.Component.extend({
  @service tabStates: null,

  @computed('viewingOwned')
  noReposMessage(tab) {
    if (tab === 'owned') {
      return 'You don\'t have any repos set up on Travis CI';
    } else {
      return 'No repositories found';
    }
  },
});
