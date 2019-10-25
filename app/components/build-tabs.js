import { computed } from '@ember/object';
import Component from '@ember/component';
import { isEmpty } from '@ember/utils';

export default Component.extend({
  tagName: 'div',
  classNames: ['travistab'],

  messagesMaxLevel: computed('build.request.messages.@each.level', function () {
    const msgs = this.get('build.request.messages');
    if (!isEmpty(msgs)) {
      return msgs.sortBy('level').lastObject.level;
    }
  }),

  messagesBadgeTooltipText: computed('messagesMaxLevel', function () {
    return `This build's config has ${this.messagesMaxLevel} level validation messages`;
  }),
});
