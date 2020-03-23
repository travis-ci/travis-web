import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';

export default Component.extend({
  tagName: '',
  statusImages: service(),

  repo: null,
  onClick() {},

  lastBuildState: reads('repo.defaultBranch.lastBuild.state'),
  defaultBranch: reads('repo.defaultBranch.name'),

  statusImageUrl: computed(
    'repo.slug',
    'repo.private',
    'defaultBranch',
    'lastBuildState',
    function () {
      const { defaultBranch, lastBuildState = 'unknown', repo } = this;

      const url = this.statusImages.imageUrl(repo, defaultBranch);
      const divider = url.includes('?') ? '&' : '?';

      return `${url}${divider}status=${lastBuildState}`;
    }
  ),
});
