import Controller from '@ember/controller';
import { later } from '@ember/runloop';

export default Controller.extend({
  referralSourceName: 'travisci-vs-jenkins',

  scrollToContact: false,
  toggleContactScroll() {
    this.set('scrollToContact', true);
    later(() => this.set('scrollToContact', false), 500);
  },

  contactSuccess() {
    this.transitionToRoute('plans.thank-you');
  },
});
