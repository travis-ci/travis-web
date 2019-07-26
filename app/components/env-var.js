import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { task } from 'ember-concurrency';

export default Component.extend({
  flashes: service(),

  tagName: 'li',
  classNames: ['settings-envvar'],
  classNameBindings: ['envVar.public:is-public', 'envVar.newlyCreated:newly-created'],
  validates: { name: ['presence'] },
  actionType: 'Save',
  showValueField: alias('public'),

  value: computed('envVar.{value,public}', function () {
    let value = this.get('envVar.value');
    let isPublic = this.get('envVar.public');

    if (isPublic) {
      return value;
    }
    return '••••••••••••••••';
  }),

  delete: task(function* () {
    yield this.envVar.destroyRecord().catch(({ errors }) => {
      if (errors.any(error => error.status == '404')) {
        this.flashes.error('This environment variable has already been deleted.' +
          ' Try refreshing.');
      } else {
        this.flashes.error('There was an error deleting this environment variable.');
      }
    });
  }).drop()
});
