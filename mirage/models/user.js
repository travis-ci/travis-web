import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  allowance: belongsTo(),
  installation: belongsTo('installation', { embed: true, inverse: 'owner' }),
});
