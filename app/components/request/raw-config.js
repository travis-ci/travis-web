import Component from '@ember/component';
import { computed } from '@ember/object';
import { equal, not } from '@ember/object/computed';
import {
  isInternal,
  presentedPath,
  codeblockName,
  fileNameWithoutSha
} from 'travis/utils/format-config';
import { later } from '@ember/runloop';
import { inject as service } from '@ember/service';

export default Component.extend({
  externalLinks: service(),

  copied: false,
  baseYmlName: '.travis.yml',

  isEmptyConfig: equal('config', '{}'),
  isExpanded: not('isEmptyConfig'),

  toggleStatusClass: computed('isExpanded', function () {
    return this.isExpanded ? 'expanded' : 'collapsed';
  }),

  buttonLabel: computed('copied', 'source', function () {
    return this.copied ? 'Copied!' : `Copy ${fileNameWithoutSha(this.source)}`;
  }),

  formattedConfig: computed('config', 'slug', function () {
    try {
      return JSON.stringify(JSON.parse(this.config), null, 2);
    } catch (e) {
      return this.config;
    }
  }),

  filePath: computed('source', 'slug', function () {
    let name = fileNameWithoutSha(this.source);
    if (name === this.baseYmlName) { return name; }
    return presentedPath(this.source, this.slug);
  }),

  fileUrl: computed('source', 'build.branchName', 'build.repo.{slug,vcsType}', function () {
    const slug = this.get('build.repo.slug');
    const vcsType = this.get('build.repo.vcsType');
    if (isInternal(this.source, slug)) {
      return;
    }

    const [owner, repo] = slug.split('/');
    const branch = this.get('build.branchName');
    const file = fileNameWithoutSha(this.source);
    return this.externalLinks.fileUrl(vcsType, { owner, repo, branch, file });
  }),

  codeblockId: computed('source', function () {
    return codeblockName(this.source);
  }),

  actions: {
    copied() {
      this.set('copied', true);
      later(() => this.set('copied', false), 3000);
    },
    toggle() {
      this.toggleProperty('isExpanded');
    }
  }
});
