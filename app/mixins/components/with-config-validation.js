import Mixin from '@ember/object/mixin';
import { gt } from '@ember/object/computed';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Mixin.create({
  auth: service(),

  messages: null,
  repo: null,

  hasMessages: gt('messages.length', 0),

  // we want to show config messages for unauthenticated users, too. however,
  // we then do not have a way to ask for the repository's config_validation
  // setting. maybe we can check if the request.messages key is present?
  showConfigValidation: true,

  messagesMaxLevel: computed('messages.@each.level', function () {
    if (this.hasMessages) {
      return this.messages.sortBy('level').lastObject.level;
    }
  }),

  messagesBadgeTooltipText: computed('messagesMaxLevel', function () {
    return `This build's config has ${this.messagesMaxLevel} level validation messages`;
  }),
});
