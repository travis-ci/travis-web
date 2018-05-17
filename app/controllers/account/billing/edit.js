import Controller from '@ember/controller';
import { service } from 'ember-decorators/service';
import { action } from 'ember-decorators/object';

export default Controller.extend({
  @service api: null,
  @service stripe: null,

  plan: 'travis-ci-ten-builds',

  @action
  save() {
    let card = this.getProperties(
      'number', 'name', 'expiry', 'cvc'
    );

    // FIXME eep
    card.number = parseInt(card.number.replace(/\s/g, ''));
    let [expiryMonth, expiryYear] = card.expiry.split('/').map(s => s.trim());
    card.exp_month = parseInt(expiryMonth);
    card.exp_year = parseInt(expiryYear) + 2000;

    let billing = this.getProperties(
      'firstName', 'lastName', 'company', 'address', 'address2',
      'city', 'state', 'country', 'zipCode', 'email', 'vatId'
    );

    card['billing_info[address]'] = billing.address;
    card['billing_info[city]'] = billing.city;
    card['billing_info[country]'] = billing.country;
    card['billing_info[last_name]'] = billing.lastName;
    card['billing_info[zip_code]'] = billing.zipCode;
    card['billing_info[billing_email]'] = billing.email;

    return this.get('stripe').card.createToken(card).then(response => {
      let stripeToken = response.id;
      let subscriptionJson = {
        'plan': this.get('plan'),
        'credit_card_info.token': stripeToken,
        'billing_info.first_name': billing.firstName,
        'billing_info.last_name': billing.lastName,
        'billing_info.company': billing.company,
        'billing_info.address': billing.address,
        'billing_info.address2': billing.address2,
        'billing_info.city': billing.city,
        'billing_info.state': billing.state,
        'billing_info.country': billing.country,
        'billing_info.zip_code': billing.zipCode,
        'billing_info.billing_email': billing.email,
        'billing_info.vat_id': billing.vatId
      };

      return this.get('api').post('/subscriptions', { data: subscriptionJson });
    }).then(result => {
      this.set('result', `success: ${JSON.stringify(result)}`);
    }).catch(result => {
      this.set('result', `error: ${JSON.stringify(result)}`);
    });
  },
});
