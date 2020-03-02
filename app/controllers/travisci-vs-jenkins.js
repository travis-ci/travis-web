import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import config from 'travis/config/environment';

export default Controller.extend({
  router: service(),

  caseStudyUrl: config.urls.caseStudy,

  goToContactForm() {
    this.router.transitionTo('plans', {
      queryParams: { section: 'contact' },
    });
  }
});
