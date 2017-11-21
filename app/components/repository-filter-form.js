import Ember from 'ember';
import { action } from 'ember-decorators/object';

export default Ember.Component.extend({
  tagName: '',
  @action
  search(query) {
    this.get('onSearch')(query);
  }
});
