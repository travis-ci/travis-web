import Ember from 'ember';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';

export default Ember.Component.extend({
  @service auth: null,
  @service tabStates: null,

  tagName: 'nav',
  classNames: ['travistab-nav', 'owner-tabs'],

  @alias('tabStates.ownerTab') tab: null,

  @computed('tab')
  repositoriesTabClass(tab) {
    return this.isActiveTab(tab, 'repositories');
  },

  @computed('tab')
  jobQueueTabClass(tab) {
    return this.isActiveTab(tab, 'job_queue');
  },

  isActiveTab(currentTab, checkedTab) {
    return currentTab === checkedTab ? 'active' : '';
  },
});
