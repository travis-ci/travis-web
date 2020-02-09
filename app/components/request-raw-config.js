import Component from '@ember/component';
import { computed } from '@ember/object';
import { match } from '@ember/object/computed';
import {
  isInternal,
  presentedPath,
  codeblockName,
  fileNameWithoutSha
} from 'travis/utils/format-config';
import { later } from '@ember/runloop';
import { inject as service } from '@ember/service';

export default Component.extend({
  tagName: 'div',
  classNames: ['request-config'],
  externalLinks: service(),
  classNameBindings: ['expanded:request-config-expanded'],

  copied: false,
  baseYmlName: '.travis.yml',
  status: undefined,
  open: match('status', /open/),

  loading: computed('config', function () {
    return !this.config;
  }),

  language: computed('config', function () {
    try {
      JSON.parse(this.config);
      return 'json';
    } catch (e) {
      return 'yaml';
    }
  }),

  replace: computed('mergeMode', function () {
    return this.mergeMode == 'replace' && this.status == 'customize';
  }),

  api: computed('source', function () {
    return this.source.includes('api');
  }),

  expanded: computed('config', function () {
    return this.get('config') !== '{}';
  }),

  toggleStatusClass: computed('expanded', function () {
    return this.expanded ? 'expanded' : 'collapsed';
  }),

  buttonLabel: computed('copied', 'source', function () {
    let source = this.get('source');
    return this.copied ? 'Copied!' : `Copy ${fileNameWithoutSha(source)}`;
  }),

  formattedConfig: computed('config', 'slug', function () {
    try {
      return JSON.stringify(JSON.parse(this.config), null, 2);
    } catch (e) {
      return this.config;
    }
  }),

  filePath: computed('source', 'slug', function () {
    let source = this.get('source');
    let name = fileNameWithoutSha(source);
    if (name === this.baseYmlName) { return name; }

    return presentedPath(source, this.slug);
  }),

  fileUrl: computed('source', 'build.branchName', 'build.repo.{slug,vcsType}', function () {
    const slug = this.get('build.repo.slug');
    const vcsType = this.get('build.repo.vcsType');
    const source = this.get('source');
    if (isInternal(source, slug)) {
      return;
    }

    const [owner, repo] = slug.split('/');
    const branch = this.get('build.branchName');
    const file = fileNameWithoutSha(source);
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
      this.toggleProperty('expanded');
    }
  }
});
