import Ember from 'ember';

const { alias } = Ember.computed;

export default Ember.Component.extend({
  tagName: 'a',
  classNames: ['switch--icon'],
  classNameBindings: ['active'],
  active: alias('hook.active'),
  click() {
    this.sendAction('onToggle');
    let hook = this.get('hook');
    return hook.toggle().then((function() {}), () => {
      this.toggleProperty('hook.active');
      return this.sendAction('onToggleError', hook);
    });
  }
});
