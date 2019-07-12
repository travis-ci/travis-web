import Mixin from '@ember/object/mixin';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

export default Mixin.create({
  vcsLinks: service(),

  urlGithubPullRequest: computed('repo.{vcsType,slug}', 'build.pullRequestNumber', function () {
    const slug = this.get('repo.slug');
    const vcsType = this.get('repo.vcsType');
    const pullRequestNumber = this.get('build.pullRequestNumber');

    return this.get('vcsLinks').pullRequestUrl(vcsType, slug, pullRequestNumber);
  }),
});
