import Component from '@ember/component';
import { computed } from '@ember/object';
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

  isExpanded: computed('rawConfig.config', function () {
    return this.get('rawConfig.config') !== '{}';
  }),

  toggleStatusClass: computed('isExpanded', function () {
    return this.isExpanded ? 'expanded' : 'collapsed';
  }),

  buttonLabel: computed('copied', 'rawConfig.source', function () {
    let source = this.get('rawConfig.source');
    return this.copied ? 'Copied!' : `Copy ${fileNameWithoutSha(source)}`;
  }),

  formattedConfig: computed('rawConfig.config', 'slug', function () {
    let config = this.get('rawConfig.config');
    try {
      return JSON.stringify(JSON.parse(config), null, 2);
    } catch (e) {
      return config;
    }
  }),

  filePath: computed('rawConfig.source', 'slug', function () {
    let source = this.get('rawConfig.source');
    let name = fileNameWithoutSha(source);
    if (name === this.baseYmlName) { return name; }

    return presentedPath(source, this.slug);
  }),

  fileUrl: computed('rawConfig.source', 'build.branchName', 'build.repo.{slug,vcsType}', function () {
    const slug = this.get('build.repo.slug');
    const vcsType = this.get('build.repo.vcsType');
    const source = this.get('rawConfig.source');
    if (isInternal(source, slug)) {
      return;
    }

    const [owner, repo] = slug.split('/');
    const branch = this.get('build.branchName');
    const file = fileNameWithoutSha(source);
    return this.externalLinks.fileUrl(vcsType, { owner, repo, branch, file });
  }),

  codeblockId: computed('rawConfig.source', function () {
    return codeblockName(this.rawConfig.source);
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
