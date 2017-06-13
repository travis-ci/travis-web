import Ember from 'ember';
import computed from 'ember-computed-decorators';
import config from 'travis/config/environment';

import timeAgoInWords from 'travis/utils/time-ago-in-words';

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
          const licenseType = response.license_type;
          const billingFrequency = response.billing_frequency;

          const isTrial = !billingFrequency &&
            ((licenseType && licenseType == 'trial') || !licenseType);

          if (isTrial) {
            this.set('isTrial', true);
            this.set('trialExpirationTime', new Date(Date.parse(expirationTime)));
          }
        });
      });
    }
  },

  isTrial: false,

  @computed('trialExpirationTime')
  isExpired(trialExpirationTime) {
    return new Date() > trialExpirationTime;
  },

  @computed('trialExpirationTime')
  expirationTimeFromNow(trialExpirationTime) {
    return new Ember.String.htmlSafe(timeAgoInWords(trialExpirationTime) || '-');
  }
});
