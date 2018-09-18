import Service from '@ember/service';
import { task } from 'ember-concurrency';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';
import { reads } from 'ember-decorators/object/computed';

export default Service.extend({
  @service store: null,

  @reads('fetchPreferences.lastSuccessful.value')
  list: null,

  @computed('list.@each.{name,value}')
  get hash() {
    const list = this.list || [];
    return list.reduce((hash, record) => {
      hash[record.name] = record;
      return hash;
    }, {});
  },

  @reads('hash.build_emails.value')
  buildEmails: false,

  fetchPreferences: task(function* () {
    return yield this.store.findAll('preference');
  }).drop(),

  update() {
    this.fetchPreferences.perform();
  },

  set(key, value) {
    const record = this.hash[key];
    record.set('value', value);
    return record.save().catch((error) => {
      record.rollbackAttributes();
      throw new Error(error);
    });
  },

  init() {
    this.update();
    return this._super(...arguments);
  }
});
