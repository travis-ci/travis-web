import { A } from '@ember/array';
import { computed } from '@ember/object';
import { isEmpty } from '@ember/utils';
import Component from '@ember/component';

export default Component.extend({
  tagName: 'div',
  classNames: ['travistab'],

  messagesMaxLevel: computed('this.job.build.request', function () {
    let msgs = A(this.get('job.build.request.messages')).rejectBy('level', 'info');
    if (msgs.length > 0) {
      return msgs.sortBy('level')[0].level;
    }
  }),

  messagesBadgeIconClass: computed('messagesMaxLevel', function () {
    let level = this.get('messagesMaxLevel');
    return `build-messages-badge icon icon-${level}`;
  }),

  messagesBadgeTooltipText: computed('messagesMaxLevel', function () {
    let level = this.get('messagesMaxLevel');
    return `This build's config has ${level} level validation messages`;
  }),

  didRender() {
    // Set the log to be default active tab unless something else is active
    if (isEmpty(this.$('.travistab-nav--secondary').find('.active'))) {
      this.$('#tab_log').addClass('active');
    }
  }
});
