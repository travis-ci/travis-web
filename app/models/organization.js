import Model from 'ember-data/model';
import attr from 'ember-data/attr';

export default Model.extend({
  name: attr(),
  login: attr(),
  avatarUrl: attr(),
});
