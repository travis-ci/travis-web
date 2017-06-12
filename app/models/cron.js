import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  branch: belongsTo('branch'),
  interval: attr('string'),
  dont_run_if_recent_build_exists: attr('boolean'),
  created_at: attr('string'),
  last_run: attr('string'),
  next_run: attr('string'),
  repo: belongsTo('repo'),
});
