import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: 'li',
  classNames: ['rows', 'my-build'],
  classNameBindings: ['state'],

  vcsLinks: service(),
  state: alias('build.state'),

  vcsBranchUrl: computed('build.repo.{slug,vcsType}', 'build.branchName', function () {
    const slug = this.get('build.repo.slug');
    const branchName = this.get('build.branchName');
    const vcsType = this.get('build.repo.vcsType');

    return this.get('vcsLinks').branchUrl(vcsType, slug, branchName);
  }),
});
