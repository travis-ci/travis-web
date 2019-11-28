import Controller from '@ember/controller';
import BillingControllerMixin from 'travis/mixins/controller/billing';
import { reads } from '@ember/object/computed';

export default Controller.extend(BillingControllerMixin, {
  account: reads('model.account'),
  newSubscription: reads('model.newSubscription'),
});
