import Ember from 'ember';
import { action } from 'ember-decorators/object';

export default Ember.Component.extend({
  tagName: '',
  @action
  onSearch(query) {
    this.get('onSearch')(query);
  }
});
