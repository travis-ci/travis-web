import Controller, { inject as controller } from '@ember/controller';
import { computed } from '@ember/object';

export default Controller.extend({
  repoController: controller('repo'),

  queryParams: ['requestId'],

  lintUrl: computed('repoController.repo.slug', function () {
    let slug = this.get('repoController.repo.slug');
    return `https://lint.travis-ci.org/${slug}`;
  })
});
