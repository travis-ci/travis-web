import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { reads, bool, filter } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import $ from 'jquery';
import moment from 'moment';
import config from 'travis/config/environment';

const { apiHost, createRequestEndpoint } = config.zendesk;

export const UTC_START_TIME = moment.utc({ h: 9, m: 0, s: 0 });
export const UTC_END_TIME = moment.utc({ h: 23, m: 0, s: 0 });
export const DATE_FORMAT = 'LT';

const USER_EMAIL_DOMAINS_BLACKLIST = [
  'users.noreply.github.com'
];

export default Component.extend({
  classNames: ['zendesk-request-form'],

  auth: service(),
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

  isLoggedIn: reads('auth.signedIn'),

  startTime: UTC_START_TIME.local().format(DATE_FORMAT),
  endTime: UTC_END_TIME.local().format(DATE_FORMAT),
  timezone: moment.tz(moment.tz.guess()).format('z'),

  isSubmitting: reads('zendeskRequest.isRunning'),
  isSuccess: bool('zendeskRequest.lastSuccessful.value'),

  zendeskRequest: task(function* () {
    const { fullName: name, email } = this.auth.currentUser;
    const { subject, description: body } = this;

    try {
      return yield $.ajax({
        type: 'POST',
        url: `${apiHost}${createRequestEndpoint}`,
        data: JSON.stringify({
          request: {
            requester: { name, email },
            subject,
            comment: { body }
          }
        }),
        contentType: 'application/json'
      });
    } catch (error) {
      if (error.readyState === 0) { // Network error
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
