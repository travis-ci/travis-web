import Owner from 'travis/models/owner';
import attr from 'ember-data/attr';

export default Owner.extend({
  type: 'organization',
  allowMigration: attr(),
});
