import Ember from 'ember';
import { task } from 'ember-concurrency';

export default Ember.Component.extend({
  tagName: 'a',
  classNames: ['switch'],
  classNameBindings: ['repository.active:active', 'disabled:disabled', 'disabled:inline-block'],
  click() {
    this.get('toggleRepository').perform();
  },

  toggleRepository: task(function* () {
    if (!this.get('disabled')) {
      this.sendAction('onToggle');

      let repository = this.get('repository');

      let pusher = this.get('pusher'),
        repoId = repository.get('id');

      yield repository.toggle().then(() => {
        pusher.subscribe(`repo-${repoId}`);
        this.toggleProperty('repository.active');
      }, () => { this.sendAction('onToggleError', repository); });
    }
  }),
});
