import Controller from '@ember/controller';
import { later } from '@ember/runloop';
import config from 'travis/config/environment';

const { blog: blogUrl } = config.urls;


export default Controller.extend({
  referralSourceName: 'travisci-vs-jenkins',

  caseStudyUrl: `${blogUrl}/2019-06-5-case-study-ibm-cloud-kubernetes-service`,

  scrollToContact: false,
  toggleContactScroll() {
    this.set('scrollToContact', true);
    later(() => this.set('scrollToContact', false), 500);
  },

  contactSuccess() {
    this.transitionToRoute('travisci-vs-jenkins.thank-you');
  },
});
