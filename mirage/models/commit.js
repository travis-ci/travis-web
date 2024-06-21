import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  build: belongsTo('build', { inverseOf: 'commit' }),
  committer: belongsTo('git-user'),
  author: belongsTo('git-user'),
  job: belongsTo('job'),
  request: belongsTo(),
});
