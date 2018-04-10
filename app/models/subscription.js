import Model from 'ember-data/model';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  billingInfo: belongsTo({ async: false }),
  owner: belongsTo('owner', {polymorphic: true})
});
