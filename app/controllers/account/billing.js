import Controller from '@ember/controller';
import { reads } from '@ember/object/computed';

export default Controller.extend({
  account: reads('model.account'),
  newSubscription: reads('model.newSubscription')
});
