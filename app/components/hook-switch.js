import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'a',
  classNames: ['switch--icon'],
  classNameBindings: ['active'],
  activeBinding: "hook.active",
  click() {
    var hook;
    this.sendAction('onToggle');
    hook = this.get('hook');
    return hook.toggle().then((function() {}), () => {
      this.toggleProperty('hook.active');
      return this.sendAction('onToggleError', hook);
    });
  }
});
