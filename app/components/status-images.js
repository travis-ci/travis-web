import Component from '@ember/component';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';

export default Component.extend({
  @service auth: null,
  @service externalLinks: null,
  @service statusImages: null,

  id: 'status-images',
  attributeBindings: ['id'],
  classNames: ['popup', 'status-images'],
  formats: ['Image URL', 'Markdown', 'Textile', 'Rdoc', 'AsciiDoc', 'RST', 'Pod', 'CCTray'],

  didReceiveAttrs() {
    this._super(...arguments);
    this.set('branch', this.get('repo.defaultBranch.name'));
  },

  @computed('format', 'repo.slug', 'branch', 'repo.defaultBranch.name')
  statusString(format, slug, branch, defaultBranchName) {
    const repo = this.get('repo');
    if (repo) {
      const imageFormat = format || this.get('formats.firstObject');
      const gitBranch = branch || defaultBranchName;

      return this.formatStatusImage(imageFormat, repo, gitBranch);
    }
  },

  formatStatusImage(format, repo, branch) {
    switch (format) {
      case 'Image URL':
        return this.get('statusImages').imageUrl(repo, branch);
      case 'Markdown':
        return this.get('statusImages').markdownImageString(repo, branch);
      case 'Textile':
        return this.get('statusImages').textileImageString(repo, branch);
      case 'Rdoc':
        return this.get('statusImages').rdocImageString(repo, branch);
      case 'AsciiDoc':
        return this.get('statusImages').asciidocImageString(repo, branch);
      case 'RST':
        return this.get('statusImages').rstImageString(repo, branch);
      case 'Pod':
        return this.get('statusImages').podImageString(repo, branch);
      case 'CCTray':
        return this.get('statusImages').ccXml(repo, branch);
    }
  },

  actions: {
    toggleStatusImageModal() {
      this.get('onClose')();
    }
  }
});
