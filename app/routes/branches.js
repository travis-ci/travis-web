import $ from 'jquery';
import ArrayProxy from '@ember/array/proxy';
import TravisRoute from 'travis/routes/basic';
import config from 'travis/config/environment';
import { inject as service } from '@ember/service';

export default TravisRoute.extend({
  repositories: service(),
  tabStates: service(),
  auth: service(),

  model(/* params*/) {
    let allTheBranches, apiEndpoint, options, repoId;
    apiEndpoint = config.apiEndpoint;
    repoId = this.modelFor('repo').get('id');
    allTheBranches = ArrayProxy.create();
    options = {
      headers: {
        'Travis-API-Version': '3'
      }
    };
    if (this.get('auth.signedIn')) {
      options.headers.Authorization = `token ${this.get('auth.token')}`;
    }

    let path = `${apiEndpoint}/repo/${repoId}/branches`;
    let includes = 'build.commit,build.created_by&limit=100';
    let url = `${path}?include=${includes}`;

    return $.ajax(url, options).then((response) => {
      allTheBranches = response.branches;
      return allTheBranches;
    });
  },

  activate() {
    if (this.get('auth.signedIn')) {
      this.set('tabStates.sidebarTab', 'owned');
      this.set('tabStates.mainTab', 'branches');
    }
  }
});
