import Owner from 'travis/models/owner';
import { attr } from '@ember-data/model';
import { reads } from '@ember/object/computed';
import { task } from 'ember-concurrency';

export default Owner.extend({
  type: 'organization',
  allowMigration: attr('boolean'),

  buildPermissions: reads('fetchBuildPermissions.lastSuccessful.value'),

  fetchBuildPermissions: task(function* () {
    const url = `/v3/org/${this.id}/build_permissions`;
    const result = yield this.api.get(url);
    if (result && result.build_permissions) {
      return result.build_permissions.map((perm) => {
        perm.user.provider = perm.user.vcs_type.toLowerCase().replace('user', '');
        if (!perm.user.name) {
          perm.user.name = perm.user.login;
        }
        return perm;
      });
    }
    return [];
  }).keepLatest(),

  changePermissions: task(function* (userIds, permission) {
    const usersArray = Array.isArray(userIds) ? userIds : [userIds];
    const url = `/v3/org/${this.id}/build_permissions`;
    const data = {
      user_ids: usersArray,
      permission: permission
    };
    yield this.api.patch(url, { data: data });
  }).drop(),
});
