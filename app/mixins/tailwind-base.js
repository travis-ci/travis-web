import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';

export default Mixin.create({
  headData: service(),

  beforeModel: function () {
    this.set('headData.useTailwindBase', true);
    return this._super(...arguments);
  },

  deactivate() {
    this.set('headData.useTailwindBase', false);
    return this._super(...arguments);
  },
});
