import Model from 'ember-data/model';
import attr from 'ember-data/attr';
import { belongsTo } from 'ember-data/relationships';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';

import vcsLinks from 'travis/utils/vcs-links';

export default Model.extend({
  sha: attr(),
  branch: attr(),
  message: attr(),
  compareUrl: attr(),
  authorName: attr(),
  authorEmail: attr(),
  committerName: attr(),
  committerEmail: attr(),
  committedAt: attr(),
  committerAvatarUrl: attr(),
  authorAvatarUrl: attr(),

  build: belongsTo('build'),

  subject: computed('message', function () {
    let message = this.get('message');
    if (message) {
      return message.split('\n', 1)[0];
    }
  }),

  body: computed('message', function () {
    let message = this.get('message');
    if (message && message.indexOf('\n') > 0) {
      return message.substr(message.indexOf('\n') + 1).trim();
    } else {
      return '';
    }
  }),

  authorIsCommitter: computed(
    'authorName',
    'authorEmail',
    'committerName',
    'committerEmail',
    function () {
      let authorName = this.get('authorName');
      let authorEmail = this.get('authorEmail');
      let committerName = this.get('committerName');
      let committerEmail = this.get('committerEmail');
      return authorName === committerName && authorEmail === committerEmail;
    }
  ),

  githubUrl: computed('build.repo.{slug,vcsType}', 'sha', function () {
    const slug = this.get('build.repo.slug');
    const sha = this.get('sha');
    const vcsType = this.get('build.repo.vcsType');

    return vcsLinks.commitUrl(vcsType, slug, sha);
  }),
});
