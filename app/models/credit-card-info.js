import Model, { attr, belongsTo } from '@ember-data/model';
import { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';

export default Model.extend({
  api: service(),
  lastDigits: attr(),

  subscription: belongsTo('subscription'),
  token: attr('string'),

  updateToken: task(function* (data) {
    this.setProperties({ token: data.tokenId, lastDigits: data.tokenCard.last4 });
    yield this.api.patch(`/subscription/${data.subscriptionId}/creditcard`, {
      data: {
        token: data.tokenId
      }
    });
  }).drop()
});
