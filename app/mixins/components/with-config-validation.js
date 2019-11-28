import Mixin from '@ember/object/mixin';
import { and, gt, reads } from '@ember/object/computed';
import { computed } from '@ember/object';

export default Mixin.create({
  messages: null,
  repo: null,

  hasMessages: gt('messages.length', 0),

  isConfigValidationEnabled: reads('repo.settings.config_validation'),

  showConfigValidation: and('isConfigValidationEnabled', 'hasMessages'),

  messagesMaxLevel: computed('messages.@each.level', function () {
    if (this.hasMessages) {
      return this.messages.sortBy('level').lastObject.level;
    }
  }),

  messagesBadgeTooltipText: computed('messagesMaxLevel', function () {
    return `This build's config has ${this.messagesMaxLevel} level validation messages`;
  }),

});
