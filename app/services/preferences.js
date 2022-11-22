import Service, { inject as service } from '@ember/service';
import { task } from 'ember-concurrency';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';

export default Service.extend({
  store: service(),

  list: reads('fetchPreferences.lastSuccessful.value'),

  hash: computed('list.@each.{name,value}', function () {
    const list = this.list || [];
    return list.reduce((hash, record) => {
      hash[record.name] = record;
      return hash;
    }, {});
  }),

  buildEmails: reads('hash.build_emails.value'),
  privateInsightsVisibility: reads('hash.private_insights_visibility.value'),
  consumeOSSCredits: reads('hash.consume_oss_credits.value'),

  fetchPreferences: task(function* (id, isOrganization) {
    if (isOrganization) {
      return yield this.store.query('preference', { organization_id: id });
    }

    return yield this.store.findAll('preference');
  }).drop(),

  set(key, value, id = null, isOrganization = null) {
    const record = this.hash[key];
    let options = {};
    if (isOrganization) {
      options.adapterOptions = { organization_id: id };
    }
    record.set('value', value);
    return record.save(options).catch((error) => {
      record.rollbackAttributes();
      throw new Error(error);
    });
  },
});
