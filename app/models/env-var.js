import Ember from 'ember';
import Model from 'travis/models/model';
import attr from 'ember-data/attr';
import { hasMany, belongsTo } from 'ember-data/relationships';

export default Model.extend({
  name: attr(),
  value: attr(),
  "public": attr('boolean'),
  repo: belongsTo('repo', { async: true })
});
