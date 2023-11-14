import { RestSerializer } from 'miragejs';

export default RestSerializer.extend({
  include: Object.freeze(['committer']),
  embed: true,
  root: false
});
