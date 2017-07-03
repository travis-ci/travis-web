import Ember from 'ember';
import config from 'travis/config/environment';
import { task } from 'ember-concurrency';

const { service } = Ember.inject;

export default Ember.Component.extend({
  tabStates: service(),

  isPR: Ember.computed('tab', function () {
    return this.get('tabStates.mainTab') === 'pull_requests';
  }),

  isBranch: Ember.computed('tab', function () {
    return this.get('tabStates.mainTab') === 'branches';
  }),
});
