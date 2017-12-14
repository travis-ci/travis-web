import Component from '@ember/component';
import { computed } from 'ember-decorators/object';

export default Component.extend({
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
