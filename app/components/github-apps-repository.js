import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  tagName: 'li',
  classNames: ['profile-repolist-item'],
  classNameBindings: ['migratable'],

  admin: computed('repository.permissions', function () {
    let permissions = this.get('repository.permissions');
    if (permissions) {
      return permissions.admin;
    }
  })

});
