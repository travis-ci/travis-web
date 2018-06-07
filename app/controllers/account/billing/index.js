/* global HS */

import Controller from '@ember/controller';
import { service } from 'ember-decorators/service';
import { controller } from 'ember-decorators/controller';
import { action, computed } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';
import config from 'travis/config/environment';

export default Controller.extend({
  @service store: null,
  config,

  @controller account: null,
  @alias('account.billingUrl') billingUrl: null,

  @computed('model.id')
  invoices(subscriptionId) {
    if (subscriptionId) {
      return this.get('store').query('invoice', { subscription_id: subscriptionId });
    } else {
      return [];
    }
  },

  @action
  helpscoutTrigger() {
    HS.beacon.open();
    return false;
  },
});
