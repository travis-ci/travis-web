import Model, { attr, belongsTo } from '@ember-data/model';
import { computed } from '@ember/object';

export default Model.extend({
  createdAt: attr('date'),
  url: attr('string'),
  status: attr('string'),
  amountDue: attr('number'),

  subscription: belongsTo('subscription'),

  year: computed('createdAt', function () {
    return this.createdAt.getFullYear();
  }),

  isUnpaid: computed('status', function () {
    return this.status !== 'paid';
  }),
  presentableStatus: computed('status', function () {
    if (this.status === 'open')
      return 'unpaid';
    return this.status;
  })
});
