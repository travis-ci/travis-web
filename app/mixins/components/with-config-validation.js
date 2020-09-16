import Mixin from '@ember/object/mixin';
import { gt, reads } from '@ember/object/computed';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

const ORDER = {
  info: 0,
  error: 2,
  warn: 1
};

function compare(left, right) {
  if (ORDER[left.level] < ORDER[right.level]) return -1;
  if (ORDER[left.level] > ORDER[right.level]) return 1;
  return 0;
}

export default Mixin.create({
  auth: service(),

  messages: reads('request.messages'),
  hasMessages: gt('messages.length', 0),

  messagesMaxLevel: computed('messages.@each.level', function () {
    if (this.hasMessages) {
      return this.messages.sort(compare).lastObject.level;
    } else {
      return 'info';
    }
  }),

  messagesBadgeTooltipText: computed('messagesMaxLevel', function () {
    return `This build's config has ${this.messagesMaxLevel} level validation messages`;
  }),
});
