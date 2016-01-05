import Ember from 'ember';

export default Ember.View.extend({
  layoutName: (function() {
    var name;
    if (name = this.get('controller.layoutName')) {
      return 'layouts/' + name;
    }
  }).property('controller.layoutName')
});
