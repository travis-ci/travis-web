import Ember from 'ember';
import config from 'travis/config/environment';

export default Ember.Component.extend({
  status: null,

  statusPageStatusUrl: function() {
    return config.statusPageStatusUrl;
  }.property(),

  didInsertElement() {
    var self, url;
    if (url = this.get('statusPageStatusUrl')) {
      self = this;
      return this.getStatus(url).then(function(response) {
        if (response.status && response.status.indicator) {
          return self.set('status', response.status.indicator);
        }
      });
    }
  },

  getStatus(url) {
    return $.ajax(url);
  }
});
