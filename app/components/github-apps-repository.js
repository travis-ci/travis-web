import Component from '@ember/component';
import { computed } from '@ember/object';
import { and } from '@ember/object/computed';

export default Component.extend({
  tagName: 'li',
  classNames: ['profile-repolist-item'],
  classNameBindings: ['migratable'],

  admin: computed('repository.permissions', function () {
    let permissions = this.get('repository.permissions');
    if (permissions) {
      return permissions.admin;
    }
  }),

  migratable: and('migrationEnabled', 'repository.permissions.migrate'),

  migrationInProgress: computed('repository.migrationStatus', function () {
    return ['migrating', 'queued'].includes(this.get('repository.migrationStatus'));
  }),
});
