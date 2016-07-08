import { Factory } from 'ember-cli-mirage';

export default Factory.extend({
  admin: true,
  push: true,
  pull: true,
  permissions: true
});
