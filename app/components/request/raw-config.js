import Component from '@ember/component';
import { computed } from '@ember/object';
import { equal, not, or } from '@ember/object/computed';
import {
  isInternal,
  presentedPath,
  codeblockName,
  fileNameWithoutSha
} from 'travis/utils/format-config';
import { later } from '@ember/runloop';
import { inject as service } from '@ember/service';
import { parseWithDefault } from 'travis/services/storage';

export default Component.extend({
  tagName: '',

  externalLinks: service(),

  copied: false,
  baseYmlName: '.travis.yml',

  expanded: not('empty'),
  empty: or('emptyYAML', 'emptyJSON'),
  emptyYAML: equal('formattedConfig', ''),
  emptyJSON: equal('formattedConfig', '{}'),

  status: computed('expanded', function () {
    return this.expanded ? 'expanded' : 'collapsed';
  }),

  buttonText: computed('copied', 'source', function () {
    return this.copied ? 'Copied' : 'Copy';
  }),

  formattedConfig: computed('config', 'slug', function () {
    let object = parseWithDefault(this.config, null);
    return object ? JSON.stringify(object, null, 2) : this.config;
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
      this.toggleProperty('expanded');
    }
  }
});
