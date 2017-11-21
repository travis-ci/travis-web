import RSVP from 'rsvp';
import TravisRoute from 'travis/routes/basic';
import { service } from 'ember-decorators/service';

export default TravisRoute.extend({
  @service repositories: null,
  @service tabStates: null,

  model() {
    let repoId = this.modelFor('repo').get('id');
    //debugger
    return RSVP.hash({
      activeBranches: this.store.paginated('branch', {
        repoId: repoId,
        existsOnGithub: true,
        includeCommit: true,
        includeRecent: true,
        sort_by: 'last_build:desc'
      }, {
        filter: (branch) => branch.get('repoId') === repoId && branch.get('existsOnGithub'),
        sort: function (a, b) {
          return parseInt(b.get('lastBuild.id')) - parseInt(a.get('lastBuild.id'));
        },
        dependencies: ['repo.id', 'existsOnGithub', 'lastBuild.id'],
        forceReload: true
      }),
      deletedBranches: this.store.paginated('branch', {
        repoId: repoId,
        existsOnGithub: false,
        includeCommit: true,
        includeRecent: true
      })
    });
  },

  activate() {
    if (this.get('auth.signedIn')) {
      this.set('tabStates.sidebarTab', 'owned');
      this.set('tabStates.mainTab', 'branches');
    }
  }
});
