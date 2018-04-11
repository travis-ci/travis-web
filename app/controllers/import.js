import Controller from '@ember/controller';
import { computed } from 'ember-decorators/object';

export default Controller.extend({
  page: 1,

  @computed("model.user", "model.organizations")
  owners(user, organizations) {
    return [user].concat(organizations.toArray());
  },

  actions: {
    import(organization) {
      debugger;
    }
  }
});
