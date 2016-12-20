import Ember from 'ember';

export default Ember.Route.extend({
  renderTemplate() {
    return this.render('error404');
  },
});
