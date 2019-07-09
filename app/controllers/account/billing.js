import Controller from '@ember/controller';
import { reads } from '@ember/object/computed';

export default Controller.extend({
  plans: reads('model.plans'),
  account: reads('model.account'),
  subscription: reads('model.subscription'),
});
