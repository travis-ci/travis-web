/* global HS */

import Controller, { inject as controller } from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import config from 'travis/config/environment';

export default Controller.extend({
  store: service(),

  config,

  accountController: controller('account'),
  account: alias('accountController.model'),

  invoices: computed('model.subscriptions.id', function () {
    let subscriptionId = this.get('model.subscriptions.id');
    if (subscriptionId) {
      return this.get('store').query('invoice', { subscription_id: subscriptionId });
    } else {
      return [];
    }
  }),

  isEducation: computed('model', 'account', function () {
    let model = this.get('model');
    let account = this.get('account');
    if (!model.subscriptions) {
      return !model.subscriptions && account.education;
    }
  }),

  isTrial: computed('model', 'account', function () {
    let model = this.get('model');
    let account = this.get('account');
    if (!model.subscriptions) {
      return !model.subscriptions && !account.education;
    }
  }),

  actions: {
    helpscoutTrigger() {
      HS.beacon.open();
      return false;
    }
  }
});
