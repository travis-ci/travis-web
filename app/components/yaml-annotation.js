import Component from '@ember/component';
import { computed } from 'ember-decorators/object';

export default Component.extend({
  @computed('annotation.lineNumber')
  top(lineNumber) {
    // FIXME extract etc obvs
    return (lineNumber + 1) * 1.2 * 14;
  }
});
