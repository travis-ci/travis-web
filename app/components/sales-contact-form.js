import Component from '@ember/component';
import { bool, reads } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import { LEAD_UTM_FIELDS } from 'travis/models/lead';
import objectCollect from 'travis/utils/object-collect';

const supportedUtmFields = Object.values(LEAD_UTM_FIELDS);

export default Component.extend({
  tagName: '',

  flashes: service(),
  raven: service(),
  store: service(),

  requiredMark: 'Required',

  isSubmitting: reads('send.isRunning'),
  isSuccess: bool('send.lastSuccessful.value'),

  lead: null,
  referralSource: 'travis-web',

  utm_source: null,
  utm_campaign: null,
  utm_medium: null,
  utm_term: null,
  utm_content: null,

  utmFields: objectCollect(...supportedUtmFields),

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
