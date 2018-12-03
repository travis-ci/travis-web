import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: 'li',
  classNames: ['rows', 'my-build'],
  classNameBindings: ['state'],

  externalLinks: service(),
  state: alias('build.state'),

  urlGitHubBranch: computed('build.repo.slug', 'build.branchName', function () {
    let slug = this.get('build.repo.slug');
    let branchName = this.get('build.branchName');
    return this.get('externalLinks').githubBranch(slug, branchName);
  }),
});
