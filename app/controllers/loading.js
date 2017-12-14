import { computed } from '@ember/object';
import Controller from '@ember/controller';

export default Controller.extend({
  layoutName: computed({
    get() {
      if (this._layoutName) {
        return `layouts/${this._layoutName}`;
      }
    },

    set(key, value) {
      return this._layoutName = value;
    }
  })
});
