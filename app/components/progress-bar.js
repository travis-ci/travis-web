import Component from '@ember/component';
import { computed } from 'ember-decorators/object';

export default Component.extend({
  tagName: '',

  @computed('progress')
  show(progress) {
    return progress > 0;
  }
});
