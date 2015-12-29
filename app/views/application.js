import BasicView from 'travis/views/basic';
import Ember from 'ember';

export default BasicView.extend({
  popup: Ember.inject.service(),
  classNames: ['application'],

  click(event) {
    var targetAndParents;
    targetAndParents = $(event.target).parents().andSelf();
    if (!(targetAndParents.hasClass('open-popup') || targetAndParents.hasClass('popup'))) {
      this.get('popup').close();
    }
    if (!targetAndParents.hasClass('menu') && !targetAndParents.is('#tools > a')) {
      return $('.menu').removeClass('display');
    }
  }
});
