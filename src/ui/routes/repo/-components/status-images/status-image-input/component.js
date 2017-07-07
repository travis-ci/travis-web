import Ember from 'ember';

export default Ember.TextArea.extend({
  click() {
    this.get('element').select();
  }
});
