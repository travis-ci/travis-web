import Model, { attr, belongsTo } from '@ember-data/model';

export default Model.extend({
  e: attr('string'),
  repo: belongsTo('repo', { async: false, inverse: null }),
  createdAt: attr('date'),
  formattedContent: attr('string'),
  jobId: attr('number'),
  buildId: attr('number'),
  buildCreatedBy: belongsTo('user', { async: false, inverse: null }),
  jobNumber: attr('string'),
  buildNumber: attr('string'),
  jobFinishedAt: attr('date'),
  commitSha: attr('string'),
  commitCompareUrl: attr('string'),
  commitBranch: attr('string')
});
