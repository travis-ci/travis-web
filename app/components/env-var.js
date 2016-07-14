import Ember from 'ember';
import { task } from 'ember-concurrency';

export default Ember.Component.extend({
  classNames: ['settings-envvar'],
  classNameBindings: ['envVar.public:is-public'],
  isDeleting: false,
  validates: { name: ['presence'] },
  actionType: 'Save',
  showValueField: Ember.computed.alias('public'),

  value: function () {
    if (this.get('envVar.public')) {
      return this.get('envVar.value');
    } else {
      return '••••••••••••••••';
    }
  }.property('envVar.value', 'envVar.public'),

  delete: task(function * () {
    yield this.get('envVar').destroyRecord();
  })
});
