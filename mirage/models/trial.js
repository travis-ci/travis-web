import { Model, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  owner: belongsTo({
    polymorphic: true
  }),
});
