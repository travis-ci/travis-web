import Ember from 'ember';
import Model from 'travis/models/model';
import attr from 'ember-data/attr';
import { hasMany, belongsTo } from 'ember-data/relationships';

export default Model.extend({
  branch: belongsTo('branch', { async: true }),
  interval: attr('string'),
  disable_by_build: attr('boolean'),
  next_enqueuing: attr('string')
});
