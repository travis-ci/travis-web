import Component from '@ember/component';
import { computed } from '@ember/object';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';
import { scheduleOnce } from '@ember/runloop';

import Log from 'travis/utils/log';
import LogFolder from 'travis/utils/log-folder';

export default Component.extend({
  externalLinks: service(),
  auth: service(),

  didInsertElement() {
    if (this.get('features.debugLogging')) {
      // eslint-disable-next-line
      console.log('log view: did insert');
    }
    this._super(...arguments);
    scheduleOnce('afterRender', this, 'setupLog');
  },

  setupLog() {
    this.engine = Log.create();
    this.logFolder = new LogFolder(this.element.querySelector('.log-body-content'));
    this.engine.set(0, this.scanResult.formattedContent);
  },

  commitUrl: computed('repo.{ownerName,vcsName,vcsType,slug}', 'scanResult.commitSha', function () {
    const owner = this.get('repo.ownerName');
    const repo = this.get('repo.vcsName');
    const vcsType = this.get('repo.vcsType');
    const vcsId = this.get('repo.vcsId');
    const commit = this.get('scanResult.commitSha');
    const slugOwner = this.get('repo.slug').split('/')[0];

    return this.externalLinks.commitUrl(vcsType, { owner, repo, commit, vcsId, slugOwner });
  }),

  branchUrl: computed('repo.{ownerName,vcsName,vcsType,slug}', 'scanResult.commitBranch', function () {
    const owner = this.get('repo.ownerName');
    const repo = this.get('repo.vcsName');
    const vcsType = this.get('repo.vcsType');
    const vcsId = this.get('repo.vcsId');
    const branch = this.get('scanResult.commitBranch');
    const slugOwner = this.get('repo.slug').split('/')[0];
    const repoType = this.get('item.repo.serverType');
    const commit = this.get('commit.sha');

    return this.externalLinks.branchUrl(vcsType, repoType, { owner, repo, branch, vcsId, slugOwner, commit });
  }),


  user: alias('auth.currentUser'),

  userHasPushPermissionForRepo: computed('repo.id', 'user', 'user.pushPermissions.[]', function () {
    let repo = this.repo;
    let user = this.user;
    if (user && repo) {
      return user.hasPushAccessToRepo(repo);
    }
  })
});
