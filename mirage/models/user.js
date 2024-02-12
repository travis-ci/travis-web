import { Model, belongsTo } from 'miragejs';

export default class extends Model{
  allowance =  belongsTo();
  installation = belongsTo('installation', { embed: true, inverse: 'owner', async: false });

}
