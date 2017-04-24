import Ember from 'ember';
import config from 'travis/config/environment';
import { task } from 'ember-concurrency';

const { service } = Ember.inject;

export default Ember.Component.extend({
  routing: service('-routing'),
  permissions: service(),
  externalLinks: service(),
  flashes: service(),

  tagName: 'li',
  classNameBindings: ['branch.lastBuild.state'],
  classNames: ['branch-row', 'row-li'],

  urlGithubCommit: Ember.computed('branch.lastBuild', function () {
    let slug = this.get('branch.repo.slug');
    let commitSha = this.get('branch.lastBuild.commit.sha');
    return this.get('externalLinks').githubCommit(slug, commitSha);
  }),

  getLast5BuildsTask: task(function* (lastBuilds) {
    let apiEndpoint = config.apiEndpoint;
    let repoId = this.get('branch.repoId');
    let branchName = this.get('branch.name');
    try {
      let options = {
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

      yield Ember.$.ajax(url, options).then(response => {
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
    } catch (e) {
      this.get('flashes')
        .error(`There was an error fetching the last five builds of ${branchName}`);
    }
  }),

  last5Builds: Ember.computed(function () {
    let lastBuilds = Ember.ArrayProxy.create({
      content: [{}, {}, {}, {}, {}],
      count: 0,
      isLoading: true
    });
    this.get('getLast5BuildsTask').perform(lastBuilds);
    return lastBuilds;
  }),

  actions: {
    viewAllBuilds() {
      return this.get('routing').transitionTo('builds');
    }
  }
});
