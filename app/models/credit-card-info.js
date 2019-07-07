import Model, { attr, belongsTo } from '@ember-data/model';

export default Model.extend({
  lastDigits: attr(),
<<<<<<< HEAD

  subscription: belongsTo('subscription'),
=======
  token: attr(),
  subscription: belongsTo(),
>>>>>>> add subscription save handler
});
