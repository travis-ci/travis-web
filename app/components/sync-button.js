import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ["sync-button"],
  actions: {
    sync() {
      return this.get('user').sync();
    }
  }
});
