import { Model, belongsTo } from 'miragejs';

export default Model.extend({
  owner: belongsTo({
    polymorphic: true,
  }),
});
