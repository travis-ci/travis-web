import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  scroller: service(),

  immediate: false,

  didInsertElement() {
    this._super(...arguments);
    const duration = this.immediate ? 1 : 1000;
    this.scroller.scrollToElement(this.element, { duration });
  }
});
