import Mixin from '@ember/object/mixin';
import { and, gt, reads } from '@ember/object/computed';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';

export default Mixin.create({
  auth: service(),

  messages: null,
  repo: null,

  hasMessages: gt('messages.length', 0),

  isConfigValidationEnabled: and('auth.signedIn', 'repo.settings.config_validation'),

  showConfigValidation: reads('isConfigValidationEnabled'),

  messagesMaxLevel: computed('messages.@each.level', function () {
    if (this.hasMessages) {
      return this.messages.sortBy('level').lastObject.level;
    }
  }),

  messagesBadgeTooltipText: computed('messagesMaxLevel', function () {
    return `This build's config has ${this.messagesMaxLevel} level validation messages`;
  }),
});
