import { run } from '@ember/runloop';
import EmberObject, { computed } from '@ember/object';
import ArrayProxy from '@ember/array/proxy';
import Component from '@ember/component';
import { alias } from '@ember/object/computed';
import { inject as service } from '@ember/service';

export default Component.extend({
  api: service(),
  auth: service(),
  store: service(),
  router: service(),
  permissions: service(),
  externalLinks: service(),

  tagName: 'li',
  classNameBindings: ['branch.last_build.state'],
  classNames: ['branch-row', 'row-li'],
  isLoading: false,
  isTriggering: false,
  hasTriggered: false,

  commitUrl: computed('branch.repository.slug', 'branch.last_build.commit.sha', 'vcsType', function () {
    const [owner, repo] = this.get('branch.repository.slug').split('/');
    const vcsType = this.get('vcsType');
    const commit = this.get('branch.last_build.commit.sha');
    return this.externalLinks.commitUrl(vcsType, { owner, repo, commit });
  }),

  vcsType: computed('branch.repository.id', function () {
    const repository = this.store.peekRecord('repo', this.get('branch.repository.id'));
    return repository.vcsType;
  }),

  provider: computed('vcsType', function () {
    return this.get('vcsType') && this.get('vcsType').toLowerCase().replace('repository', '');
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
    let branchName, lastBuilds, repoId;
    lastBuilds = ArrayProxy.create({
      content: [{}, {}, {}, {}, {}],
      isLoading: true,
      count: 0
    });
    if (!this.get('branch.last_build')) {
      lastBuilds.set('isLoading', false);
    } else {
      repoId = this.get('branch.repository.id');
      branchName = encodeURIComponent(this.get('branch.name'));

      const path = `/repo/${repoId}/builds`;
      const params = `?branch.name=${branchName}&limit=5&build.event_type=push,api,cron`;
      const url = `${path}${params}`;

      this.api.get(url).then(response => {
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
      return this.router.transitionTo('builds');
    }
  }
});
