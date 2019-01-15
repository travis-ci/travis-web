import { run } from '@ember/runloop';
import EmberObject, { computed } from '@ember/object';
import $ from 'jquery';
import ArrayProxy from '@ember/array/proxy';
import Component from '@ember/component';
import config from 'travis/config/environment';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  auth: service(),
  router: service(),
  permissions: service(),
  externalLinks: service(),

  tagName: 'li',
  classNameBindings: ['branch.last_build.state'],
  classNames: ['branch-row', 'row-li'],
  isLoading: false,
  isTriggering: false,
  hasTriggered: false,

  urlGithubCommit: computed('branch.repository.slug', 'branch.last_build.commit.sha', function () {
    let slug = this.get('branch.repository.slug');
    let sha = this.get('branch.last_build.commit.sha');
    return this.get('externalLinks').githubCommit(slug, sha);
  }),

  rawCreatedBy: alias('branch.last_build.created_by'),

  createdBy: computed(
    'rawCreatedBy.name',
    'rawCreatedBy.login',
    'rawCreatedBy.avatar_url',
    function () {
      let name = this.get('rawCreatedBy.name');
      let login = this.get('rawCreatedBy.login');
      let avatarUrl = this.get('rawCreatedBy.avatar_url');
      return {
        name,
        login,
        avatarUrl
      };
    }
  ),

  rawCommit: alias('branch.last_build.commit'),

  commit: computed(
    'rawCommit.author.name',
    'rawCommit.author.avatar_url',
    'rawCommit.committer.name',
    'rawCommit.committer.avatar_url',
    function () {
      let authorName = this.get('rawCommit.author.name');
      let authorAvatarUrl = this.get('rawCommit.author.avatar_url');
      let committerName = this.get('rawCommit.committer.name');
      let committerAvatarUrl = this.get('rawCommit.committer.avatar_url');
      let authorIsCommitter =
        authorName === committerName && authorAvatarUrl === committerAvatarUrl;

      return {
        authorIsCommitter,
        authorName,
        authorAvatarUrl,
        committerName,
        committerAvatarUrl
      };
    }
  ),

  getLast5Builds: computed(function () {
    let apiEndpoint, branchName, lastBuilds, options, repoId;
    lastBuilds = ArrayProxy.create({
      content: [{}, {}, {}, {}, {}],
      isLoading: true,
      count: 0
    });
    if (!this.get('branch.last_build')) {
      lastBuilds.set('isLoading', false);
    } else {
      apiEndpoint = config.apiEndpoint;
      repoId = this.get('branch.repository.id');
      branchName = encodeURIComponent(this.get('branch.name'));
      options = {
        headers: {
          'Travis-API-Version': '3'
        }
      };
      if (this.get('auth.signedIn')) {
        options.headers.Authorization = `token ${this.get('auth.token')}`;
      }
      let path = `${apiEndpoint}/repo/${repoId}/builds`;
      let params = `?branch.name=${branchName}&limit=5&build.event_type=push,api,cron`;
      let url = `${path}${params}`;

      $.ajax(url, options).then(response => {
        let array, i, trueLength;
        array = response.builds.map(build => EmberObject.create(build));
        // We need exactly 5 elements in array
        if (array.length < 5) {
          trueLength = array.length;
          for (i = trueLength; i < 5; i++) {
            array.push({});
          }
        }

        run(() => {
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
      return this.get('router').transitionTo('builds');
    }
  }
});
