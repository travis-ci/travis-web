import Ember from 'ember';

export default Ember.Component.extend({
  popup: Ember.inject.service(),
  classNames: ['application'],

  click(event) {
    var targetAndParents = $(event.target).parents().andSelf();

    if (!(targetAndParents.hasClass('open-popup') || targetAndParents.hasClass('popup'))) {
      this.get('popup').close();
    }
    if (!targetAndParents.hasClass('menu') && !targetAndParents.is('#tools > a')) {
      $('.menu').removeClass('display');
    }
  }
});
