import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'button',
  classNames: ['switch'],
  classNameBindings: ['repository.active:active', 'disabled:disabled', 'disabled:inline-block'],

  click() {
    if (!this.get('disabled')) {
      this.get('toggleRepositoryTask').perform();
    }
  },
});
