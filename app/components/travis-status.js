import Ember from 'ember';
import config from 'travis/config/environment';
import { computed } from 'ember-decorators/object';

export default Ember.Component.extend({
  status: null,

  @computed()
  statusPageStatusUrl() {
    return config.statusPageStatusUrl;
  },

  didInsertElement() {
    let url = this.get('statusPageStatusUrl');
    if (url) {
      return this.getStatus(url).then((response) => {
        if (response.status && response.status.indicator) {
          return this.set('status', response.status.indicator);
        }
      });
    }
  },

  getStatus(url) {
    return Ember.$.ajax(url);
  }
});
