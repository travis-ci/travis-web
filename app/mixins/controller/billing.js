import Mixin from '@ember/object/mixin';
import { reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Mixin.create({
  storage: service(),

  account: reads('model.account'),
  selectedPlan: null,
  queryParams: ['billingStep'],
  billingStep: 1,
});
