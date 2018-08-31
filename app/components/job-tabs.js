import { isEmpty } from '@ember/utils';
import Component from '@ember/component';

export default Component.extend({

  tagName: 'div',
  classNames: ['travistab'],

  didRender() {
    // Set the log to be default active tab unless something else is active
    if (isEmpty(this.$('.travistab-nav--secondary').find('.active'))) {
      this.$('#tab_log').addClass('active');
    }
  }
});
