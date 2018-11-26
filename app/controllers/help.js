import Controller from '@ember/controller';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { reads, equal } from '@ember/object/computed';
import moment from 'moment';
import config from 'travis/config/environment';

const UTC_START_TIME = moment.utc({ h: 9, m: 0, s: 0 });
const UTC_END_TIME = moment.utc({ h: 23, m: 0, s: 0 });
const DATE_FORMAT = 'LT';

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

  startTime: UTC_START_TIME.local().format(DATE_FORMAT),
  endTime: UTC_END_TIME.local().format(DATE_FORMAT),
  timezone: moment.tz(moment.tz.guess()).format('z'),

  actions: {

    setAnchor(anchor) {
      if (Object.values(ANCHOR).includes(anchor)) {
        this.set('anchor', anchor);
      }
    }

  }

});
