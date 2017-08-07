import Ember from 'ember';
import { service } from 'ember-decorators/service';

export default Ember.Component.extend({
  @service popup: null,

  classNames: ['application'],

  click(event) {
    let targetAndParents = Ember.$(event.target).parents().addBack();

    if (!(targetAndParents.hasClass('open-popup') || targetAndParents.hasClass('popup'))) {
      this.get('popup').close();
    }
    if (!targetAndParents.hasClass('menu') && !targetAndParents.is('#tools > a')) {
      Ember.$('.menu').removeClass('display');
    }
  }
});
