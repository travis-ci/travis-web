import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';

export default Mixin.create({
  stripe: service(),

  beforeModel() {
    return this.stripe.load();
  }
});
