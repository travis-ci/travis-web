import Controller from '@ember/controller';
import { later } from '@ember/runloop';

export default Controller.extend({
  scrollToContact: false,
  toggleContactScroll() {
    this.set('scrollToContact', true);

    later(() => this.set('scrollToContact', false), 500);
  },
});
