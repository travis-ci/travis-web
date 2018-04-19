import Controller from '@ember/controller';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';

export default Controller.extend({
  @service store: null,

  @computed('model.id')
  invoices(subscriptionId) {
    if (subscriptionId) {
      return this.get('store').query('invoice', { subscription_id: subscriptionId });
    } else {
      return [];
    }
  },
});
