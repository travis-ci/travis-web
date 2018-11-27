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

  docsUrl: computed(() => docs),
  communityUrl: computed(() => `${community}/top`),

  actions: {

    setAnchor(anchor) {
      if (Object.values(ANCHOR).includes(anchor)) {
        this.set('anchor', anchor);
      }
    }

  }

});
