import Ember from 'ember';
import Model from 'travis/models/model';

export default Model.extend({
  name: DS.attr(),
  value: DS.attr(),
  "public": DS.attr('boolean'),
  repo: DS.belongsTo('repo', { async: true })
});
