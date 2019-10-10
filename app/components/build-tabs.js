import { computed } from '@ember/object';
import Component from '@ember/component';
import { isEmpty } from '@ember/utils';

export default Component.extend({
  tagName: 'div',
  classNames: ['travistab'],

  messagesMaxLevel: computed('build.request.messages.@each.level', function () {
    let msgs = this.get('build.request.messages');
    if (msgs instanceof Array && msgs.length > 0) {
      return msgs.sortBy('level')[0].level;
    }
  }),

  messagesBadgeTooltipText: computed('messagesMaxLevel', function () {
    let level = this.get('messagesMaxLevel');
    return `This build's config has ${level} level validation messages`;
  }),

  didRender() {
    // Set the log to be default active tab unless something else is active
    if (isEmpty(this.$('.travistab-nav--secondary').find('.active'))) {
      this.$('.travistab-nav--secondary li:first-child a').addClass('active');
    }
  }
});
