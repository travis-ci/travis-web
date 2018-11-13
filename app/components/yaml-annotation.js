import Component from '@ember/component';
import { computed } from 'ember-decorators/object';
import { htmlSafe } from '@ember/string';

export default Component.extend({
  @computed('annotation.line')
  top(line) {
    let lineHeight = 18; // FIXME ???
    return lineHeight * line;
  },

  @computed('top')
  style(top) {
    return htmlSafe(`top: ${top}px;`);
  }
});
