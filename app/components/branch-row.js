import { run } from '@ember/runloop';
import EmberObject from '@ember/object';
import $ from 'jquery';
import ArrayProxy from '@ember/array/proxy';
import Component from '@ember/component';
import config from 'travis/config/environment';
import { computed } from 'ember-decorators/object';
import { service } from 'ember-decorators/service';

export default Component.extend({
  @service auth: null,
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
  },

  actions: {
    viewAllBuilds() {
      return this.get('router').transitionTo('builds');
    }
  }
});
