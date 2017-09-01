import Ember from 'ember';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';

export default Ember.Component.extend({
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

  @computed('format', 'repo.slug', 'branch', 'repo.defaultBranch')
  statusString(format, slug, branch, defaultBranch) {
    const imageFormat = format || this.get('formats.firstObject');
    const gitBranch = branch || defaultBranch.name;
    return this.formatStatusImage(imageFormat, slug, gitBranch);
  },

  formatStatusImage(format, slug, branch) {
    switch (format) {
      case 'Image URL':
        return this.get('statusImages').imageUrl(slug, branch);
      case 'Markdown':
        return this.get('statusImages').markdownImageString(slug, branch);
      case 'Textile':
        return this.get('statusImages').textileImageString(slug, branch);
      case 'Rdoc':
        return this.get('statusImages').rdocImageString(slug, branch);
      case 'AsciiDoc':
        return this.get('statusImages').asciidocImageString(slug, branch);
      case 'RST':
        return this.get('statusImages').rstImageString(slug, branch);
      case 'Pod':
        return this.get('statusImages').podImageString(slug, branch);
      case 'CCTray':
        return this.get('statusImages').ccXml(slug, branch);
    }
  },

  actions: {
    toggleStatusImageModal() {
      this.get('onClose')();
    }
  }
});
