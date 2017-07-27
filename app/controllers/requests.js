import Ember from 'ember';
import { controller } from 'ember-decorators/controller';
import { computed } from 'ember-decorators/object';

export default Ember.Controller.extend({
  @controller('repo') repoController: null,

  @computed('repoController.repo.slug')
  lintUrl(slug) {
    return `https://lint.travis-ci.org/${slug}`;
  },
});
