import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { bindKeyboardShortcuts, unbindKeyboardShortcuts } from 'ember-keyboard-shortcuts';

export default Component.extend({
  auth: service(),
  externalLinks: service(),
  statusImages: service(),

  id: 'status-images',
  attributeBindings: ['id'],
  classNames: ['popup', 'status-images'],
  formats: ['Image URL', 'Markdown', 'Textile', 'Rdoc', 'AsciiDoc', 'RST', 'Pod', 'CCTray'],

  keyboardShortcuts: {
    'esc': 'toggleStatusImageModal'
  },

  didReceiveAttrs() {
    this._super(...arguments);
    this.set('branch', this.get('repo.defaultBranch.name'));
  },

  didInsertElement() {
    this._super(...arguments);
    bindKeyboardShortcuts(this);
  },

  willDestroyElement() {
    this._super(...arguments);
    unbindKeyboardShortcuts(this);
  },

  statusString: computed('format', 'repo.slug', 'branch', 'repo.defaultBranch.name', function () {
    let format = this.get('format');
    let branch = this.get('branch');
    let defaultBranchName = this.get('repo.defaultBranch.name');

    const repo = this.get('repo');
    if (repo) {
      const imageFormat = format || this.get('formats.firstObject');
      const gitBranch = branch || defaultBranchName;

      return this.formatStatusImage(imageFormat, repo, gitBranch);
    }
  }),

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
