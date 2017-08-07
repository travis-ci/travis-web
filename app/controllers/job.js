import Ember from 'ember';
import { service } from 'ember-decorators/service';
import { controller } from 'ember-decorators/controller';
import { computed, observes } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';

export default Ember.Controller.extend({
  @service auth: null,
  @service externalLinks: null,

  @controller('repo') repoController: null,
  @alias('repoController.repo') repo: null,
  @alias('auth.currentUser') currentUser: null,
  @alias('repoController.tab') tab: null,

  @computed('repo.slug', 'commit.sha')
  urlGithubCommit(slug, sha) {
    return this.get('externalLinks').githubCommit(slug, sha);
  },

  @observes('job.state')
  jobStateDidChange(state) {
    return this.send('faviconStateDidChange', state);
  },
});
