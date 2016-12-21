import Ember from 'ember';

export default Ember.Service.extend({
  open(name) {
    this.close();
    this.set('popupName', name);
    Ember.$(`#${name}`).toggleClass('display');
  },

  close() {
    this.set('popupName', null);
    Ember.$('.popup').removeClass('display');
  }
});
