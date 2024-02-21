import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  owner: belongsTo('owner', { polymorphic: true, inverse: 'installation' })
});
