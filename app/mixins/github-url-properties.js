import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Mixin.create({
  externalLinks: service(),

  urlGithubPullRequest: computed('repo.slug', 'build.pullRequestNumber', function () {
    let slug = this.get('repo.slug');
    let pullRequestNumber = this.get('build.pullRequestNumber');
    return this.get('externalLinks').githubPullRequest(slug, pullRequestNumber);
  }),
});
