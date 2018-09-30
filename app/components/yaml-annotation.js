import Component from '@ember/component';
import { computed } from 'ember-decorators/object';

export default Component.extend({
  @computed('annotation.line')
  top(line) {
    let lineHeight = 18; // FIXME ???
    return lineHeight * line;
  }
});
