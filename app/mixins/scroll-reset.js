import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';

export default Mixin.create({
  fastboot: service(),

  beforeModel: function () {
    if (!this.fastboot.isFastBoot) window.scrollTo(0, 0);
    return this._super(...arguments);
  }
});
