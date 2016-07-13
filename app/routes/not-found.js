import Ember from 'ember';
import TravisRoute from 'travis/routes/basic';

export default TravisRoute.extend({
  renderTemplate() {
    Ember.$('body').attr('id', 'not-found');
    return this.render('not_found');
  }
});
