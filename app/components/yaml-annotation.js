import Component from '@ember/component';
import { computed } from 'ember-decorators/object';
import { htmlSafe } from '@ember/string';
import { getOwner } from '@ember/application';

export default Component.extend({
  @computed('annotation.lineNumber')
  top(lineNumber) {
    // FIXME extract etc obvs
    return lineNumber * 15;
  },

  // FIXME obvious hackery
  @computed('annotation.message.code', 'annotation.message.args')
  readableMessage(code, args) {
    let BuildMessage = getOwner(this).lookup('component:build-message');
    if (BuildMessage[code]) {
      return htmlSafe(BuildMessage[code](args));
    } else {
      return htmlSafe(`unrecognised message code <code>${escape(code)}</code>`);
    }
  },
});
