import { isEmpty } from '@ember/utils';
import Component from '@ember/component';

export default Component.extend({

  tagName: 'div',
  classNames: ['travistab'],

  didInsertElement() {
    if (isEmpty(this.$('.travistab-nav--secondary').find('.active'))) {
      this.$('#tab_log').addClass('active');
    }
  }
});
