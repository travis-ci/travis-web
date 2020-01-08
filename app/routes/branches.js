import TravisRoute from 'travis/routes/basic';
import { inject as service } from '@ember/service';
import ArrayProxy from '@ember/array/proxy';

export default TravisRoute.extend({
  repositories: service(),
  tabStates: service(),
  api: service(),
  auth: service(),

  model() {
    const repoId = this.modelFor('repo').get('id');
    const path = `/repo/${repoId}/branches`;
    const includes = 'build.commit,build.created_by&limit=100';
    const url = `${path}?include=${includes}`;

    return this.api.get(url).then((response) =>
      ArrayProxy.create({ content: response.branches })
    );
  },

  activate() {
    if (this.get('auth.signedIn')) {
      this.set('tabStates.sidebarTab', 'owned');
      this.set('tabStates.mainTab', 'branches');
    }
  }
});
