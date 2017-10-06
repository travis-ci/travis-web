import Controller from '@ember/controller';
import { controller } from 'ember-decorators/controller';
import { computed } from 'ember-decorators/object';

export default Controller.extend({
  @controller('repo') repoController: null,

  queryParams: ['requestId'],

  @computed('repoController.repo.slug')
  lintUrl(slug) {
    return `https://lint.travis-ci.org/${slug}`;
  }
});
