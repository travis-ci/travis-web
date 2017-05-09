import Ember from 'ember';
import { alias } from 'ember-computed-decorators';

export default Ember.Service.extend({
  ownedRecords: [],

  @alias('ownedRecords.firstObject') currentRepository: null,
});
