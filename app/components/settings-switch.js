import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'a',
  classNames: ['switch'],
  classNameBindings: ['active'],

  click() {
    var setting;
    if (this.get('isSaving')) {
      return;
    }
    this.set('isSaving', true);
    this.toggleProperty('active');
    setting = {};
    setting[this.get('key')] = this.get('active');
    return this.get('repo').saveSettings(setting).then(() => {
      return this.set('isSaving', false);
    }, () => {
      this.set('isSaving', false);
      return Travis.flash({
        error: 'There was an error while saving settings. Please try again.'
      });
    });
  }
});
