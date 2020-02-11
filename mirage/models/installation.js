import { Model, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  owner: belongsTo('owner', { polymorphic: true, inverse: 'installation' })
});
