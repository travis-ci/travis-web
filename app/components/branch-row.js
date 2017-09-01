import Ember from 'ember';
import config from 'travis/config/environment';
import { computed } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';

export default Ember.Component.extend({
  @service router: null,
  @service permissions: null,
  @service externalLinks: null,

  tagName: 'li',
  classNameBindings: ['branch.last_build.state'],
  classNames: ['branch-row', 'row-li'],
  isLoading: false,
  isTriggering: false,
  hasTriggered: false,

  @computed('branch.repository.slug', 'branch.last_build.commit.sha')
  urlGithubCommit(slug, sha) {
    return this.get('externalLinks').githubCommit(slug, sha);
  },

  @computed()
  getLast5Builds() {
    let apiEndpoint, branchName, lastBuilds, options, repoId;
    lastBuilds = Ember.ArrayProxy.create({
      content: [{}, {}, {}, {}, {}],
      isLoading: true,
      count: 0
    });
    if (!this.get('branch.last_build')) {
      lastBuilds.set('isLoading', false);
    } else {
      apiEndpoint = config.apiEndpoint;
      repoId = this.get('branch.repository.id');
      branchName = this.get('branch.name');
      options = {
        headers: {
          'Travis-API-Version': '3'
        }
      };
      if (this.get('auth.signedIn')) {
        options.headers.Authorization = `token ${this.auth.token()}`;
      }
      let path = `${apiEndpoint}/repo/${repoId}/builds`;
      let params = `?branch.name=${branchName}&limit=5&build.event_type=push,api,cron`;
      let url = `${path}${params}`;

      Ember.$.ajax(url, options).then(response => {
        let array, i, ref;
        array = response.builds.map(build => Ember.Object.create(build));
        // TODO: Clean this up, all we want to do is have 5 elements no matter
        // what. This code doesn't express that very well.
        if (array.length < 5) {
          for (i = 1, ref = 5 - array.length; i <= ref; i += 1) {
            array.push({});
          }
        }

        Ember.run(() => {
          lastBuilds.set('count', response['@pagination'].count);
          lastBuilds.set('content', array);
          lastBuilds.set('isLoading', false);
        });
      });
    }
    return lastBuilds;
  },

  actions: {
    viewAllBuilds() {
      return this.get('router').transitionTo('builds');
    }
  }
});
