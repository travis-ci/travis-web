import Controller from '@ember/controller';
import { later } from '@ember/runloop';
import config from 'travis/config/environment';

export default Controller.extend({
  caseStudyUrl: config.urls.caseStudy,

  scrollToContact: false,
  toggleContactScroll() {
    this.set('scrollToContact', true);
    later(() => this.set('scrollToContact', false), 500);
  },
});
