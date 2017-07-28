import Ember from 'ember';
import { service } from 'ember-decorators/service';

export default Ember.Component.extend({
  @service randomLogo: null,
});
