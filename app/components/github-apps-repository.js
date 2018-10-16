import Component from '@ember/component';
import { computed } from 'ember-decorators/object';
import { and } from 'ember-decorators/object/computed';

export default Component.extend({
  tagName: 'li',
  classNames: ['profile-repolist-item'],
  classNameBindings: ['migratable'],

  @computed('repository.permissions')
  admin(permissions) {
    if (permissions) {
      return permissions.admin;
    }
  },

  @and('migrationEnabled', 'repository.permissions.migrate') migratable: null,
});
