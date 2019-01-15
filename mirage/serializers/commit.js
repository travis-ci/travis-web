import { RestSerializer } from 'ember-cli-mirage';

export default RestSerializer.extend({
  include: Object.freeze(['committer']),
  embed: true,
  root: false
});
