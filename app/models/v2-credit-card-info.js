import Model, { attr, belongsTo } from '@ember-data/model';
import { inject as service } from '@ember/service';

export default Model.extend({
  api: service(),
  lastDigits: attr(),

  subscription: belongsTo('v2-subscription'),
  token: attr('string'),

  updateToken(subscriptionId, { id, card }) {
    this.setProperties({ token: id, lastDigits: card.last4 });
    return this.api.patch(`/v2_subscription/${subscriptionId}/creditcard`, {
      data: {
        token: id
      }
    });
  }
});
