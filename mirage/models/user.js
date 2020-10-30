import { Model, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  allowance: belongsTo(),
  installation: belongsTo('installation', { embed: true, inverse: 'owner' }),
});
