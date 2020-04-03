import Controller, { inject as controller } from '@ember/controller';
import { computed } from '@ember/object';
import { reads, bool } from '@ember/object/computed';

export default Controller.extend({
  repoController: controller('repo'),

  queryParams: ['requestId'],
  repo: reads('repoController.repo'),
  isAdmin: bool('repo.permissions.admin'),

  lintUrl: computed('repo.slug', function () {
    let slug = this.get('repoController.repo.slug');
    return `https://lint.travis-ci.org/${slug}`;
  })
});
