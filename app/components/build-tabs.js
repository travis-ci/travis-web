import Component from '@ember/component';
import { isEmpty } from '@ember/utils';

export default Component.extend({
  tagName: 'div',
  classNames: ['travistab'],

  didRender() {
    // Set the log to be default active tab unless something else is active
    if (isEmpty(this.$('.travistab-nav--secondary').find('.active'))) {
      this.$('.travistab-nav--secondary li:first-child a').addClass('active');
    }
  }
});
