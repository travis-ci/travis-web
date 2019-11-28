import Controller from '@ember/controller';
import { reads } from '@ember/object/computed';
import BillingControllerMixin from 'travis/mixins/controller/billing';

export default Controller.extend(BillingControllerMixin, {
  account: reads('model.account'),
  newSubscription: reads('model.newSubscription')
});
