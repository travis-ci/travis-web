import Controller from '@ember/controller';
import { service } from 'ember-decorators/service';
import { action } from 'ember-decorators/object';

export default Controller.extend({
  @service api: null,
  @service stripe: null,

  @action
  save() {
    let card = this.getProperties(
      'number', 'name', 'expiry', 'cvc'
    );

    return this.get('stripe').card.createToken(card).then(response => {
      let stripeToken = response.id;
      let subscriptionJson = {
        'credit_card_info.token': stripeToken,
        testy: 'nesty'
      };

      return this.get('api').post('/subscriptions', { data: subscriptionJson });
    });
  },
});
