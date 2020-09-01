import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  externalLinks: service(),

  tagName: 'li',
  classNames: ['rows', 'my-build'],
  classNameBindings: ['state'],

  state: alias('build.state'),

  branchUrl: computed('build.repo.{slug,vcsType}', 'build.branchName', function () {
    const [owner, repo] = (this.get('build.repo.slug') || '').split('/');
    const vcsType = this.get('build.repo.vcsType');
    const vcsId = this.get('build.repo.vcsId');
    const branch = this.get('build.branchName');

    return this.externalLinks.branchUrl(vcsType, { owner, repo, branch, vcsId });
  }),

  commitUrl: computed('build.repo.{slug,vcsType}', 'build.commit.sha', function () {
    const [owner, repo] = (this.get('build.repo.slug') || '').split('/');
    const vcsType = this.get('build.repo.vcsType');
    const vcsId = this.get('build.repo.vcsId');
    const commit = this.get('build.commit.sha');

    return this.externalLinks.commitUrl(vcsType, { owner, repo, commit, vcsId });
  }),
});
