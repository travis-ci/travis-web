import Controller from '@ember/controller';
import { computed } from 'ember-decorators/object';

export default Controller.extend({
  isLoading: false,
  page: 1,
  tab: null,

  @computed('tab')
  isInsights(tab) {
    return typeof tab === 'string' && tab.toLowerCase() === 'insights';
  },
});
