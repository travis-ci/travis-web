import Model from 'ember-data/model';

import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';

export default Model.extend({
  build: belongsTo({ async: true }),

  number: attr(),
  name: attr()
});
