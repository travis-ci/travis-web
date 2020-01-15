import Owner from 'travis/models/owner';
import { attr, hasMany } from '@ember-data/model';

export default Owner.extend({
  type: 'organization',
  allowMigration: attr('boolean'),
  preferences: hasMany('preference', { async: true }),
});
