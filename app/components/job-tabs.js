import { computed } from '@ember/object';
import { match, not } from '@ember/object/computed';
import { isEmpty } from '@ember/utils';
import Component from '@ember/component';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: 'div',
  classNames: ['travistab'],

  router: service(),

  isConfig: match('router.currentRouteName', /config$/),
  isLog: not('isConfig'),

  messagesMaxLevel: computed('job.build.request.messages.@each.level', function () {
    const msgs = this.get('job.build.request.messages');
    if (!isEmpty(msgs)) {
      return msgs.sortBy('level').lastObject.level;
    }
  }),

  messagesBadgeTooltipText: computed('messagesMaxLevel', function () {
    return `This build's config has ${this.messagesMaxLevel} level validation messages`;
  }),
});
