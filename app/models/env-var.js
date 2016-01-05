import Ember from 'ember';
import Model from 'travis/models/model';
import DS from 'ember-data';

export default Model.extend({
  name: DS.attr(),
  value: DS.attr(),
  "public": DS.attr('boolean'),
  repo: DS.belongsTo('repo', { async: true })
});
