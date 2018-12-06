import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',

  actions: {
    search(query) {
      this.get('onSearch')(query);
    }
  }
});
