import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { task } from 'ember-concurrency';

export default Component.extend({
  flashes: service(),
  api: service(),

  tagName: 'li',
  classNames: ['settings-envvar'],
  classNameBindings: ['envVar.public:is-public', 'envVar.newlyCreated:newly-created'],
  validates: { name: ['presence'] },
  actionType: 'Save',
  showValueField: alias('public'),

  envVarDeleted(key) {},

  value: computed('envVar.{value,public}', function () {
    let value = this.get('envVar.value');
    let isPublic = this.get('envVar.public');

    if (isPublic) {
      return value;
    }
    return '••••••••••••••••';
  }),


  delete: task(function* () {
    try {
      yield this.api.delete(`/account_env_var/${this.envVar.id}`);
    } catch (e) {}

    this.envVarDeleted(this.envVar);
  }).drop()
});
