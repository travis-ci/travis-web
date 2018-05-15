/* global HS */

import Controller from '@ember/controller';
import { service } from 'ember-decorators/service';
import { action, computed } from 'ember-decorators/object';
import config from 'travis/config/environment';

let currencyAbbreviationToSymbol = {
  EUR: '€',
  USD: '$'
};

let sourceToSentence = {
  manual: 'This is a manual subscription.',
  github: 'This subscription is managed by GitHub Marketplace.',
  stripe: 'This plan is paid through Stripe.'
};

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

  @computed('model.plan.currency', 'model.plan.price')
  price(currency, price) {
    return `${currencyAbbreviationToSymbol[currency]}${price / 100} per month`;
  },

  @computed('model.source')
  source(source) {
    return `${sourceToSentence[source]}`;
  },

  @action
  helpscoutTrigger() {
    HS.beacon.open();
    return false;
  },
});
