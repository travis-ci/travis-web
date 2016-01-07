import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['settings-envvar'],
  classNameBindings: ['envVar.public:is-public'],
  isDeleting: false,
  validates: { name: ['presence'] },
  actionType: 'Save',
  showValueField: Ember.computed.alias('public'),

  value: function(key) {
    if (this.get('envVar.public')) {
      return this.get('envVar.value');
    } else {
      return '••••••••••••••••';
    }
  }.property('envVar.value', 'envVar.public'),

  actions: {
    "delete": function() {
      if (this.get('isDeleting')) {
        return;
      }
      this.set('isDeleting', true);
      return this.get('envVar').destroyRecord();
    }
  }
});
