import Component from '@ember/component';
import { bool, reads } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { UTM_FIELD_NAMES } from 'travis/services/utm';
import objectCollect from 'travis/utils/object-collect';

export default Component.extend({
  tagName: '',

  flashes: service(),
  raven: service(),
  store: service(),
  storage: service(),
  utm: service(),

  requiredMark: 'Required',

  isSubmitting: reads('send.isRunning'),
  isSuccess: bool('send.lastSuccessful.value'),

  lead: null,
  referralSource: 'travis-web',

  utm_source: reads('utm.source'),
  utm_campaign: reads('utm.campaign'),
  utm_medium: reads('utm.medium'),
  utm_term: reads('utm.term'),
  utm_content: reads('utm.content'),

  utmFields: objectCollect(...UTM_FIELD_NAMES),

  send: task(function* () {
    try {
      yield this.lead.save();
      this.reset();
      this.onSuccess();
      return true;
    } catch (error) {
      this.flashes.error(
        "Something went wrong while submitting your request. We're working to fix it!"
      );
      this.raven.logException('Lead/Close request: API request error');
      throw error;
    }
  }).drop(),

  onSuccess() {},

  reset() {
    if (this.lead) this.lead.unloadRecord();
    this.set('lead', this.store.createRecord('lead', {
      referral_source: this.referralSource,
      utm_fields: this.utmFields,
    }));
  },

  // Lifecycle
  didInsertElement() {
    this.reset();
    this.flashes.clear();
    return this._super(...arguments);
  },

  willDestroyElement() {
    this.flashes.clear();
    return this._super(...arguments);
  }
});
