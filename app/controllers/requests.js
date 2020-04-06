import Controller, { inject as controller } from '@ember/controller';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';

export default Controller.extend({
  repoController: controller('repo'),

  queryParams: ['requestId'],
  slug: reads('repoController.repo.slug'),

  lintUrl: computed('slug', function () {
    return `https://lint.travis-ci.org/${this.slug}`;
  })
});
