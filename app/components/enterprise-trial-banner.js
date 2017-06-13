import Ember from 'ember';
import computed from 'ember-computed-decorators';
import config from 'travis/config/environment';

const { service } = Ember.inject;

export default Ember.Component.extend({
  ajax: service(),

  init() {
    this._super(...arguments);

    const replicatedApiEndpoint = config.replicatedApiEndpoint;

    if (replicatedApiEndpoint) {
      const url = `${replicatedApiEndpoint}/license/v1/license`;

      Ember.$.ajax(url).then(response => {
        Ember.run(() => {
          const expirationTime = response.expiration_time;

          if (expirationTime) {
            this.set('isTrial', true);
            this.set('trialExpirationTime', new Date(Date.parse(response.expiration_time)));
          }
        });
      });
    }
  },

  isTrial: false,

  @computed('trialExpirationTime')
  isExpired(trialExpirationTime) {
    return new Date() > trialExpirationTime;
  }
});
