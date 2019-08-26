import Owner from 'travis/models/owner';
import { attr } from '@ember-data/model';

export default Owner.extend({
  type: 'organization',
  allowMigration: attr('boolean'),
});
