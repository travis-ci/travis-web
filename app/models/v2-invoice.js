import Model, { attr, belongsTo } from '@ember-data/model';
import { computed } from '@ember/object';

export default Model.extend({
  createdAt: attr('date'),
  url: attr('string'),
  amountDue: attr('number'),

  subscription: belongsTo('v2-subscription'),

  year: computed('createdAt', function () {
    return this.createdAt.getFullYear();
  })
});
