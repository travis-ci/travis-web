import Ember from 'ember';
import { task } from 'ember-concurrency';

export default Ember.Component.extend({
  tagName: 'a',
  classNames: ['switch'],
  classNameBindings: ['hook.active:active', 'disabled:disabled', 'disabled:inline-block'],
  click() {
    this.get('toggleHook').perform();
  },

  toggleHook: task(function* () {
    if (!this.get('disabled')) {
      this.sendAction('onToggle');

      let hook = this.get('hook');

      let pusher = this.get('pusher'),
        repoId = hook.get('id');

      yield hook.toggle().then(() => {
        pusher.subscribe(`repo-${repoId}`);
      }, () => {
        this.toggleProperty('hook.active');
        return this.sendAction('onToggleError', hook);
      });
    }
  }),
});
