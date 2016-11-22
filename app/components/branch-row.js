import Ember from 'ember';
import config from 'travis/config/environment';

const { service } = Ember.inject;

export default Ember.Component.extend({
  routing: service('-routing'),
  permissions: service(),
  externalLinks: service(),

  tagName: 'li',
  classNameBindings: ['branch.last_build.state'],
  classNames: ['branch-row', 'row-li'],
  isLoading: false,
  isTriggering: false,
  hasTriggered: false,

  urlGithubCommit: Ember.computed('branch.last_build', function () {
    let slug = this.get('branch.repository.slug');
    let commitSha = this.get('branch.last_build.commit.sha');
    return this.get('externalLinks').githubCommit(slug, commitSha);
  }),

  getLast5Builds: Ember.computed(function () {
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
      options = {};
      if (this.get('auth.signedIn')) {
        options.headers = {
          Authorization: `token ${this.auth.token()}`
        };
      }
      let path = `${apiEndpoint}/v3/repo/${repoId}/builds`;
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
  }),

  actions: {
    viewAllBuilds() {
      return this.get('routing').transitionTo('builds');
    }
  }
});
