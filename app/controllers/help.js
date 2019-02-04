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

  queryParams: ['anchor', 'page'],
  anchor: ANCHOR.TOP,
  page: '',

  isLoggedIn: reads('auth.signedIn'),

  toTop: equal('anchor', ANCHOR.TOP),
  toDocs: equal('anchor', ANCHOR.DOCS),
  toCommunity: equal('anchor', ANCHOR.COMMUNITY),
  toForm: equal('anchor', ANCHOR.FORM),

  docsUrl: computed(() => `${docs}?utm_source=help-page&utm_medium=travisweb`),

  communityUrl: computed(() =>
    `${community}/top?utm_source=${UTM_SOURCE}&utm_medium=${UTM_MEDIUM}`
  ),

  tutorialUrl: computed(() =>
    `${docs}/user/tutorial?utm_source=help-page&utm_medium=travisweb`
  ),

  dockerUrl: computed(() =>
    `${docs}/user/docker?utm_source=help-page&utm_medium=travisweb`
  ),

  nodeJsUrl: computed(() =>
    `${docs}/user/languages/javascript-with-nodejs?utm_source=help-page&utm_medium=travisweb`
  ),

  operatingSystemUrl: computed(() =>
    `${docs}/user/multi-os?utm_source=help-page&utm_medium=travisweb`
  ),

  buildNotRunningUrl: computed(() =>
    `${docs}/user/common-build-problems/#i-pushed-a-commit-and-cant-find-its-corresponding-build?utm_source=help-page&utm_medium=travisweb`
  ),
  actions: {

    setAnchor(anchor) {
      if (Object.values(ANCHOR).includes(anchor)) {
        this.set('anchor', anchor);
      }
    }

  }

});
