import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  owner_id: null,
  owner_type: 'User',
  accepted_at: null,
  organizations() {
    return [];
  }
});
