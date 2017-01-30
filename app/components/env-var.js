import Ember from 'ember';
import { task } from 'ember-concurrency';

export default Ember.Component.extend({
  tagName: 'li',
  classNames: ['settings-envvar'],
  classNameBindings: ['envVar.public:is-public'],
  isDeleting: false,
  validates: { name: ['presence'] },
  actionType: 'Save',
  showValueField: Ember.computed.alias('public'),

  value: Ember.computed('envVar.value', 'envVar.public', function () {
    if (this.get('envVar.public')) {
      return this.get('envVar.value');
    } else {
      return '••••••••••••••••';
    }
  }),

  delete: task(function* () {
    yield this.get('envVar').destroyRecord();
  }).drop()
});
