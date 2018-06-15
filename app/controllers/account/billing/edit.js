import Controller from '@ember/controller';
import { service } from 'ember-decorators/service';
import { action, computed } from 'ember-decorators/object';

import jsvat from 'npm:jsvat';

export default Controller.extend({
  @service api: null,
  @service stripe: null,

  plan: 'travis-ci-ten-builds',
  country: '',


  @computed('plans.[]', 'annualCycle')
  promotedPlans(plans, annualCycle) {
    let monthlyPromotedPlanIds = ['travis-ci-one-build', 'travis-ci-two-builds',
        'travis-ci-five-builds', 'travis-ci-ten-builds'],
      annualPromotedPlanIds = ['travis-ci-one-build-annual', 'travis-ci-two-builds-annual',
        'travis-ci-five-builds-annual', 'travis-ci-ten-builds-annual'];

    let promotedPlanIds = annualCycle ? annualPromotedPlanIds : monthlyPromotedPlanIds;

    return plans.toArray().sortBy('builds').filter(plan => promotedPlanIds.includes(plan.id));
  },

  // Define list of EU Countries and U.K.
  @computed('country')
  showVat(country) {
    let vatCountries = ['Austria', 'Belgium', 'Bulgaria', 'Croatia', 'Cyprus', 'Czech Republic',
      'Denmark', 'Estonia', 'Finland', 'France', 'Germany', 'Greece', 'Hungary', 'Ireland', 'Italy',
      'Latvia', 'Lithuania', 'Luxembourg', 'Malta', 'Netherlands', 'Poland', 'Portugal', 'Romania',
      'Slovakia', 'Slovenia', 'Spain', 'Sweden', 'United Kingdom'];


    return vatCountries.includes(country);
  },

  @action
  save() {
    let billing = this.getProperties(
      'firstName', 'lastName', 'company', 'address', 'address2',
      'city', 'state', 'country', 'zipCode', 'email', 'vatId'
    );

    if (!jsvat.checkVAT(billing.vatId).isValid) {
      this.set('result', 'vat is invalid');
      this.set('vatIdError', 'is invalid');
      return;
    }

    let card = this.getProperties(
      'number', 'name', 'expiryMonth', 'expiryYear', 'cvc'
    );

    // FIXME eep
    card.number = parseInt((card.number || '').replace(/\s/g, ''));
    card.exp_month = parseInt(card.expiryMonth);
    card.exp_year = parseInt(card.expiryYear);

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
      this.set('result', `error: ${JSON.stringify(result.error.type)}`);
    });
  },
});
