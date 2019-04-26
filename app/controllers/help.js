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

const { docs, community } = config.urls;

export default Controller.extend({
  auth: service(),
  features: service(),

  queryParams: ['anchor', 'page'],
  anchor: ANCHOR.TOP,
  page: '',

  isLoggedIn: reads('auth.signedIn'),
  isPro: reads('features.proVersion'),

  toTop: equal('anchor', ANCHOR.TOP),
  toDocs: equal('anchor', ANCHOR.DOCS),
  toCommunity: equal('anchor', ANCHOR.COMMUNITY),
  toForm: equal('anchor', ANCHOR.FORM),

  docsUrl: computed(() => `${docs}?utm_source=help-page&utm_medium=travisweb`),

  communityUrl: computed(() =>
    `${community}/top?utm_source=${UTM_SOURCE}&utm_medium=${UTM_MEDIUM}`
  ),

  actions: {

    setAnchor(anchor) {
      if (Object.values(ANCHOR).includes(anchor)) {
        this.set('anchor', anchor);
      }
    }

  }

});
