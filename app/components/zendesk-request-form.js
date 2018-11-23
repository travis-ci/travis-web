import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';
import { task, timeout } from 'ember-concurrency';

export default Component.extend({
  classNames: ['zendesk-request-form'],

  auth: service(),

  email: reads('auth.currentUser.email'),
  subject: '',
  description: '',

  zendeskRequest: task(function* () {
    yield timeout();
  })
});
