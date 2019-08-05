import Model, { attr, belongsTo } from '@ember-data/model';
import { inject as service } from '@ember/service';

export default Model.extend({
  api: service(),
  lastDigits: attr(),

  subscription: belongsTo('subscription'),
  token: attr(),

  updateToken(subscriptionId, { id, card}) {
    this.set('token', id);
    this.set('lastDigits', card.last4);
    return this.api.patch(`/subscription/${subscriptionId}/creditcard`, {
      data: {
        token: id
      }
    });
  }
});
