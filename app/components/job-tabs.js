import Ember from 'ember';

export default Ember.Component.extend({

  tagName: 'div',
  classNames: ['travistab'],

  didInsertElement() {
    if (Ember.isEmpty(this.$('.travistab-nav--secondary').find('.active'))) {
      this.$('#tab_log').addClass('active');
    }
  }
});
