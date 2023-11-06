import Model, { attr, belongsTo } from '@ember-data/model';

export default Model.extend({
  firstName: attr('string'),
  lastName: attr('string'),
  company: attr('string'),
  address: attr('string'),
  address2: attr('string'),
  city: attr('string'),
  state: attr('string'),
  zipCode: attr('string'),
  country: attr('string'),
  vatId: attr('string'),
  billingEmail: attr('string'),
  billingEmailRead: attr('string'),

  hasLocalRegistration: attr('boolean'),

  subscription: belongsTo('v2-subscription'),

  didUpdate() {
    this.setAttribute('billingEmailRead', this.billingEmail)
  }
});
