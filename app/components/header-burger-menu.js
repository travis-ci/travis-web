import Component from '@ember/component';
import { action } from 'ember-decorators/object';

export default Component.extend({
  @action
  toggleBurgerMenu() {
    this.toggleProperty('is-open');
    return false;
  },
});
