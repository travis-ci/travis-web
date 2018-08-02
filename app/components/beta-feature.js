import Component from '@ember/component';
import { computed } from 'ember-decorators/object';

export default Component.extend({
  tagName: 'li',
  classNames: ['feature'],

  @computed('feature.description')
  description(description) {
    return description.substr(0, 60);
  }
});
