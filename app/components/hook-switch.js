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

    let pusher = this.get('pusher'),
      repoId = hook.get('id');

    return hook.toggle().then(() => {
      pusher.subscribe(`repo-${repoId}`);
    }, () => {
      this.toggleProperty('hook.active');
      return this.sendAction('onToggleError', hook);
    });
  }
});
