import Model, { attr, belongsTo } from '@ember-data/model';

export default Model.extend({
  e: attr('string'),
  repo: belongsTo('repo'),
  createdAt: attr('date'),
  formattedContent: attr('string'),
  jobId: attr('number'),
  buildId: attr('number'),
  buildCreatedBy: belongsTo('user'),
  jobNumber: attr('string'),
  buildNumber: attr('string'),
  jobFinishedAt: attr('date'),
  commitSha: attr('string'),
  commitCompareUrl: attr('string'),
  commitBranch: attr('string')
});
