import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { reads, equal } from '@ember/object/computed';
import config from 'travis/config/environment';

export const ANCHOR = {
  TOP: 'top',
  DOCS: 'docs',
  COMMUNITY: 'community',
  FORM: 'form'
};

const UTM_SOURCE = 'help-page';
const UTM_MEDIUM = 'travisweb';
const UTM_PARAMS = `?utm_source=${UTM_SOURCE}&utm_medium=${UTM_MEDIUM}`;

const { docs, community, docker, node, multiOS, noRun, tutorial, billingOverview, autoRefill, billingFaq } = config.urls;

export default Controller.extend({
  auth: service(),
  features: service(),

  queryParams: ['anchor', 'page', 'billing'],
  anchor: ANCHOR.TOP,
  billing: 'false',
  page: '',

  isSignedIn: reads('auth.signedIn'),

  toTop: equal('anchor', ANCHOR.TOP),
  toDocs: equal('anchor', ANCHOR.DOCS),
  toCommunity: equal('anchor', ANCHOR.COMMUNITY),
  toForm: equal('anchor', ANCHOR.FORM),
  isBilling: equal('billing', 'true'),

  utmParams: computed(() => UTM_PARAMS),
  docsUrl: computed(() => `${docs}${UTM_PARAMS}`),
  dockerUrl: computed(() => `${docker}${UTM_PARAMS}`),
  nodeUrl: computed(() => `${node}${UTM_PARAMS}`),
  multiOsUrl: computed(() => `${multiOS}${UTM_PARAMS}`),
  noRunUrl: computed(() => `${noRun}${UTM_PARAMS}`),
  tutorialUrl: computed(() => `${tutorial}${UTM_PARAMS}`),
  billingOverviewUrl: computed(() => `${billingOverview}${UTM_PARAMS}`),
  autoRefillUrl: computed(() => `${autoRefill}${UTM_PARAMS}`),
  faqUrl: computed(() => `${billingFaq}${UTM_PARAMS}`),

  communityUrl: computed(() => `${community}/top${UTM_PARAMS}`),

  actions: {

    setAnchor(anchor) {
      if (Object.values(ANCHOR).includes(anchor)) {
        this.set('anchor', anchor);
      }
    }

  }

});
