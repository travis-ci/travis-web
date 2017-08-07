import Ember from 'ember';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';
import { task } from 'ember-concurrency';

export default Ember.Component.extend({
  @service flashes: null,

  tagName: 'li',
  classNames: ['settings-envvar'],
  classNameBindings: ['envVar.public:is-public', 'envVar.newlyCreated:newly-created'],
  validates: { name: ['presence'] },
  actionType: 'Save',
  @alias('public') showValueField: null,

  @computed('envVar.{value,public}')
  value(value, isPublic) {
    if (isPublic) {
      return value;
    }
    return '••••••••••••••••';
  },

  delete: task(function* () {
    yield this.get('envVar').destroyRecord().catch(({ errors }) => {
      if (errors.any(error => error.status == '404')) {
        this.get('flashes').error('This environment variable has already been deleted.' +
          ' Try refreshing.');
      } else {
        this.get('flashes').error('There was an error deleting this environment variable.');
      }
    });
  }).drop()
});
