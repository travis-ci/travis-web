import { Model, belongsTo } from 'ember-cli-mirage';

export default Model.extend({
  installation: belongsTo('installation', { embed: true }),
});
