import Ember from 'ember';
import { task } from 'ember-concurrency';
import { computed } from 'ember-decorators/object';

export default Ember.Component.extend({
  tagName: 'button',
  classNames: ['switch'],
  classNameBindings: ['hook.active:active', 'disabled:disabled', 'disabled:inline-block'],

  attributeBindings: ['aria-checked', 'role'],

  role: 'switch',

  click() {
    this.get('toggleHook').perform();
  },

  @computed('hook.active')
  'aria-checked'(active) {
    if (active) {
      return 'true';
    } else {
      return 'false';
    }
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
