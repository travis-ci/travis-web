import Ember from 'ember';

const { service } = Ember.inject;

export default Ember.Component.extend({
  popup: service(),
  classNames: ['application'],

  click(event) {
    let targetAndParents = Ember.$(event.target).parents().andSelf();

    if (!(targetAndParents.hasClass('open-popup') || targetAndParents.hasClass('popup'))) {
      this.get('popup').close();
    }
    if (!targetAndParents.hasClass('menu') && !targetAndParents.is('#tools > a')) {
      Ember.$('.menu').removeClass('display');
    }
  }
});
