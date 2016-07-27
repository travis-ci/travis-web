import Ember from 'ember';
import config from 'travis/config/environment';

export default Ember.Component.extend({
  status: null,

  statusPageStatusUrl: Ember.computed(() => config.statusPageStatusUrl),

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
