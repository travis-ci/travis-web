import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import {
  reads,
  bool,
  filter,
  filterBy,
  not,
  or,
  and,
  empty,
  notEmpty
} from '@ember/object/computed';
import { task } from 'ember-concurrency';
import moment from 'moment';
import config from 'travis/config/environment';

const { apiHost, createRequestEndpoint } = config.zendesk;
const { community } = config.urls;

export const UTC_START_TIME = moment.utc({ h: 9, m: 0, s: 0 });
export const UTC_END_TIME = moment.utc({ h: 23, m: 0, s: 0 });
export const DATE_FORMAT = 'LT';

const USER_EMAIL_DOMAINS_BLACKLIST = [
  'users.noreply.github.com'
];

export default Component.extend({
  classNames: ['zendesk-request-form'],

  accounts: service(),
  ajax: service(),
  auth: service(),
  features: service(),
  flashes: service(),
  raven: service(),

  page: '',

  email: reads('auth.currentUser.email'),
  emails: filter('auth.currentUser.emails', email => {
    const emailDomain = email.split('@')[1];
    return emailDomain && !USER_EMAIL_DOMAINS_BLACKLIST.includes(emailDomain);
  }),

  subject: '',

  description: reads('descriptionTemplate'),

  descriptionTemplate: computed(function () {
    return buildDescriptionTemplate(this.page);
  }),

  isSignedIn: reads('auth.signedIn'),
  isNotSignedIn: not('isSignedIn'),
  isPro: reads('features.proVersion'),

  subscriptions: reads('accounts.subscriptions'),
  activeSubscriptions: filterBy('subscriptions', 'isSubscribed', true),
  isSubscribed: notEmpty('activeSubscriptions'),
  isEducation: reads('auth.currentUser.education'),

  trial: reads('auth.currentUser.trial'),
  trialBuildsRemaining: reads('trial.buildsRemaining'),
  noTrialYet: empty('trial'),

  isPremium: or('isSubscribed', 'isEducation', 'trialBuildsRemaining', 'noTrialYet'),

  showSupportForm: and('isPro', 'isSignedIn', 'isPremium'),
  showLoginPrompt: and('isPro', 'isNotSignedIn'),

  utmParams: '',
  communityUrl: computed('utmParams', function () {
    return `${community}/top${this.utmParams}`;
  }),
  featureRequestUrl: computed('utmParams', function () {
    return `${community}/c/product/feature-requests${this.utmParams}`;
  }),

  startTime: UTC_START_TIME.local().format(DATE_FORMAT),
  endTime: UTC_END_TIME.local().format(DATE_FORMAT),
  timezone: moment.tz(moment.tz.guess()).format('z'),

  isSubmitting: reads('zendeskRequest.isRunning'),
  isSuccess: bool('zendeskRequest.lastSuccessful.value'),

  zendeskRequest: task(function* () {
    const { fullName: name } = this.auth.currentUser;
    const { email, subject, description: body } = this;

    try {
      return yield this.ajax.request(createRequestEndpoint, 'POST', {
        host: apiHost,
        data: {
          request: {
            requester: { name, email },
            subject,
            comment: { body }
          }
        },
        contentType: 'application/json'
      });
    } catch (error) {
      if (error.isNetworkError) { // Network error
        this.flashes.error(
          "We're sorry, API is currently unavailable, please try to submit again a bit later"
        );
        this.raven.logException('Zendesk request: network error');
      } else { // Unknown error
        this.flashes.error(
          "Something went wrong while submitting your request. We're working to fix it!"
        );
        this.raven.logException('Zendesk request: API request error');
      }
      throw error;
    }
  }),

  didInsertElement() {
    this.flashes.clear();
    if (!this.email && this.emails && this.emails.length) {
      this.set('email', this.emails.firstObject);
    }
    return this._super(...arguments);
  },

  willDestroyElement() {
    this.flashes.clear();
    return this._super(...arguments);
  },

  actions: {

    handleSubmit() {
      this.zendeskRequest.perform();
      return false;
    },

    goBack() {
      window.history.go(-1);
    }

  }

});

function buildDescriptionTemplate(page) {
  const { language, vendor, userAgent, platform, appVersion } = navigator;
  /* eslint-disable */
  return `

–––––––––––––––
The following details will be sent along to help us help you better, but you may also edit them as you like.

Page: ${page}

Technical details:
- UserAgent: ${userAgent}
- Vendor: ${vendor}
- Platform: ${platform}
- App Version: ${appVersion}
- Language: ${language}
`;
  /* eslint-enable */
}
