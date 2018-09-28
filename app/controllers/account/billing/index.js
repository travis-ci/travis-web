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

  @controller('account') accountController: null,
  @alias('accountController.model') account: null,

  @computed('model.subscriptions.id')
  invoices(subscriptionId) {
    if (subscriptionId) {
      return this.get('store').query('invoice', { subscription_id: subscriptionId });
    } else {
      return [];
    }
  },

  @computed('model', 'account')
  isEducation(model, account) {
    if (!model.subscriptions) {
      return !model.subscriptions && account.education;
    }
  },

  @computed('model', 'account')
  isTrial(model, account) {
    if (!model.subscriptions) {
      return !model.subscriptions && !account.education;
    }
  },

  @action
  helpscoutTrigger() {
    HS.beacon.open();
    return false;
  },
});
