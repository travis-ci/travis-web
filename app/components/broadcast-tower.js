import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['broadcast'],
  isOpen: false,
  timeoutId: '',
  actions: {
    toggleBroadcasts() {
      this.toggleProperty('isOpen');
      this.sendAction('toggleBroadcasts');
      if (this.get('isOpen') === true) {
        return this.set('timeoutId', setTimeout(() => {
          this.toggleProperty('isOpen');
          return this.sendAction('toggleBroadcasts');
        }, 10000));
      } else {
        return clearTimeout(this.get('timeoutId'));
      }
    }
  }
});
