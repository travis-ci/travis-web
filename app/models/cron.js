import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  branch: belongsTo('branch', { async: true }),
  interval: attr('string'),
  disable_by_build: attr('boolean'),
  created_at: attr('string')
});
