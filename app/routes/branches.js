import ArrayProxy from '@ember/array/proxy';
import TravisRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';

export default TravisRoute.extend({
  repositories: service(),
  tabStates: service(),
  api: service(),
  auth: service(),

  model() {
    const repoId = this.modelFor('repo').get('id');
    let allTheBranches = ArrayProxy.create();

    const path = `/repo/${repoId}/branches`;
    const includes = 'build.commit,build.created_by&limit=100';
    const url = `${path}?include=${includes}`;

    return this.api.get(url).then((response) => {
      allTheBranches = response.branches;
      return allTheBranches;
    });
  },

  activate() {
    if (this.get('auth.signedIn')) {
      this.set('tabStates.sidebarTab', 'owned');
      this.set('tabStates.mainTab', 'branches');
    }
  },

  beforeModel() {
    const repo = this.modelFor('repo');
    if (repo && !repo.repoOwnerAllowance) {
      repo.fetchRepoOwnerAllowance.perform();
    }
  }
});
