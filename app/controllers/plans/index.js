import Controller from '@ember/controller';
import config from 'travis/config/environment';
import { equal, reads } from '@ember/object/computed';
import { inject as service } from '@ember/service';

const ANCHOR = {
  ENTERPRISE_SECTION: 'enterprise-section',
};

export default Controller.extend({
  queryParams: ['anchor'],

  auth: service(),
  metrics: service(),

  config,
  anchor: '',
  scrollToEnterpriseSection: equal('anchor', ANCHOR.ENTERPRISE_SECTION),
  billingUrl: `${config.billingEndpoint}/account/plan`,
  buildMatrixUrl: config.urls.buildMatrix,
  enterpriseUrl: config.urls.enterprise,

  plans: reads('model.plans'),
  scrollToContact: false,

  actions: {
    signIn() {
      this.auth.signIn();
    },

    signUp() {
      this.transitionToRoute('signup');
    },

    toggleContactScroll() {
      this.set('scrollToContact', true);
      setTimeout(
        () => this.set('scrollToContact', false),
        500
      );
    },

    contactSuccess() {
      this.transitionToRoute('plans.thank-you');
    },
  }
});
