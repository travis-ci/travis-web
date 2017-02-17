import Ember from 'ember';
import BaseRouteMixin from 'travis/mixins/base-route';

export default Ember.Route.extend(BaseRouteMixin, {
  renderTemplate() {
    Ember.$('body').attr('id', 'not-found');
    return this.render('not_found');
  }
});
