import { RestSerializer } from 'ember-cli-mirage';

export default RestSerializer.extend({
  include: ['committer'],
  embed: true,
  root: false
});
