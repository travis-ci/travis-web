import Ember from 'ember';

export default Ember.Component.extend({
  tagName: '',

  actions: {
    onSearch(query) {
      this.get('onSearch')(query);
    }
  }
});
