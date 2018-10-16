import Component from '@ember/component';
import { isEmpty } from '@ember/utils';
import { equal } from '@ember/object/computed';

export default Component.extend({

  tagName: 'div',
  classNames: ['travistab'],

  isWindows: equal('job.config.content.os', 'windows'),

  didRender() {
    // Set the log to be default active tab unless something else is active
    if (isEmpty(this.$('.travistab-nav--secondary').find('.active'))) {
      this.$('#tab_log').addClass('active');
    }
  }
});
