import Ember from 'ember';

export default Ember.Service.extend({
  open(name) {
    var ref;
    this.close();
    name = (typeof event !== "undefined" && event !== null ? (ref = event.target) != null ? ref.name : void 0 : void 0) || name;
    this.set('popupName', name);
    $("#" + name).toggleClass('display');
  },

  close() {
    this.set('popupName', null);
    $('.popup').removeClass('display');
  }
});
