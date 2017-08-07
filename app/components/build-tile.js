import Ember from 'ember';
import { computed } from 'ember-decorators/object';

export default Ember.Component.extend({
  tagName: 'li',
  classNameBindings: ['build.state'],
  attributeBindings: ['title'],

  @computed('build.{number,state}')
  title(number, state) {
    if (number) {
      return `Build #${number} ${state}`;
    } else {
      return '';
    }
  },
});
