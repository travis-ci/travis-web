import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  classNames: ['zendesk-request-form'],

  auth: service(),

  page: '',

  email: reads('auth.currentUser.email'),

  subject: '',

  description: computed(function () {
    return buildDescriptionTemplate(this.page);
  }),

  isSubmitting: reads('zendeskRequest.isRunning'),

  zendeskRequest: task(function* () {
    yield timeout(10000);
  }),

  actions: {

    handleSubmit() {
      this.zendeskRequest.perform();
      return false;
    }

  }

});

function buildDescriptionTemplate(page) {
  const { language, vendor, userAgent, platform, appVersion } = navigator;
  return `

–––––––––––––––
Page: ${page}

Technical details:
- UserAgent: ${userAgent}
- Vendor: ${vendor}
- Platform: ${platform}
- App Version: ${appVersion}
- Language: ${language}
`;
}
