import $ from 'jquery';
import TravisRoute from 'travis/routes/basic';
import { service } from 'ember-decorators/service';

export default TravisRoute.extend({
  @service featureFlags: null,

  titleToken: 'Beta Features',

  model() {
    return this.get('featureFlags.fetchTask').perform({ forceServerRequest: true });
  },

  renderTemplate() {
    $('body').attr('class', 'features');
    this._super(...arguments);
  },

  needsAuth: true
});
