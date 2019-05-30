import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { reads, equal, filterBy, notEmpty, or, and, not } from '@ember/object/computed';
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

const { docs, community, docker, node, multiOS, noRun, tutorial } = config.urls;

export default Controller.extend({
  accounts: service(),
  auth: service(),
  features: service(),

  queryParams: ['anchor', 'page'],
  anchor: ANCHOR.TOP,
  page: '',

  isLoggedIn: reads('auth.signedIn'),
  isNotLoggedIn: not('isLoggedIn'),
  isPro: reads('features.proVersion'),

  subscriptions: reads('accounts.subscriptions'),
  activeSubscriptions: filterBy('subscriptions', 'isSubscribed', true),
  isSubscribed: notEmpty('activeSubscriptions'),
  isEducation: reads('accounts.user.education'),
  isPremium: or('isSubscribed', 'isEducation'),
  showSupportForm: and('isPro', 'isLoggedIn', 'isPremium'),
  showLoginPrompt: and('isPro', 'isNotLoggedIn'),

  toTop: equal('anchor', ANCHOR.TOP),
  toDocs: equal('anchor', ANCHOR.DOCS),
  toCommunity: equal('anchor', ANCHOR.COMMUNITY),
  toForm: equal('anchor', ANCHOR.FORM),

  docsUrl: computed(() => `${docs}${UTM_PARAMS}`),
  dockerUrl: computed(() => `${docker}${UTM_PARAMS}`),
  nodeUrl: computed(() => `${node}${UTM_PARAMS}`),
  multiOsUrl: computed(() => `${multiOS}${UTM_PARAMS}`),
  noRunUrl: computed(() => `${noRun}${UTM_PARAMS}`),
  tutorialUrl: computed(() => `${tutorial}${UTM_PARAMS}`),

  communityUrl: computed(() => `${community}/top${UTM_PARAMS}`),
  featureRequestUrl: computed(() => `${community}/c/product/feature-requests${UTM_PARAMS}`),

  actions: {

    setAnchor(anchor) {
      if (Object.values(ANCHOR).includes(anchor)) {
        this.set('anchor', anchor);
      }
    }

  }

});
