import Ember from 'ember';
const { service } = Ember.inject;
import { task } from 'ember-concurrency';

export default Ember.Component.extend({
  tagName: 'li',
  classNames: ['settings-envvar'],
  classNameBindings: ['envVar.public:is-public', 'envVar.newlyCreated:newly-created'],
  isDeleting: false,
  validates: { name: ['presence'] },
  actionType: 'Save',
  showValueField: Ember.computed.alias('public'),

  flashes: service(),

  value: Ember.computed('envVar.value', 'envVar.public', function () {
    if (this.get('envVar.public')) {
      return this.get('envVar.value');
    } else {
      return '••••••••••••••••';
    }
  }),

  delete: task(function* () {
    yield this.get('envVar').destroyRecord().catch(({ errors }) => {
      if (errors.any(error => error.status == '404')) {
        this.get('flashes').error('There was an error deleting this environment variable' +
          ' because it had already been deleted. Try refreshing?');
      } else {
        this.get('flashes').error('There was an error deleting this environment variable.');
      }
    });
  }).drop()
});
