/* global HS */

import Controller from '@ember/controller';
import { service } from 'ember-decorators/service';
import { action, computed } from 'ember-decorators/object';
import config from 'travis/config/environment';

export default Controller.extend({
  @service store: null,
  config,

  @computed('model.id')
  invoices(subscriptionId) {
    if (subscriptionId) {
      return this.get('store').query('invoice', { subscription_id: subscriptionId });
    } else {
      return [];
    }
  },

  @computed('model.plan.price')
  price(price) {
    return `$${price / 100} per month`;
  },

  @action
  helpscoutTrigger() {
    HS.beacon.open();
    return false;
  },
});
