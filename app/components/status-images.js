import Ember from 'ember';
import Config from 'travis/config/environment';
import { service } from 'ember-decorators/service';
import { computed } from 'ember-decorators/object';
import { alias } from 'ember-decorators/object/computed';

export default Ember.Component.extend({
  @service popup: null,
  @service auth: null,
  @service externalLinks: null,
  @service statusImages: null,

  @alias('popup.popupName') popupName: null,

  id: 'status-images',
  attributeBindings: ['id'],
  classNames: ['popup', 'status-images'],
  formats: ['Image URL', 'Markdown', 'Textile', 'Rdoc', 'AsciiDoc', 'RST', 'Pod', 'CCTray'],

  @computed('popupName', 'repo.id')
  branches(popupName, repoId) {
    if (popupName === 'status-images') {
      let array = Ember.ArrayProxy.create({ content: [] }),
        apiEndpoint = Config.apiEndpoint,
        options = {
          headers: {
            'Travis-API-Version': '3'
          }
        };

      array.set('isLoaded', false);

      if (this.get('auth.signedIn')) {
        options.headers.Authorization = `token ${this.auth.token()}`;
      }

      let url = `${apiEndpoint}/repo/${repoId}/branches?limit=100`;
      Ember.$.ajax(url, options).then(response => {
        if (response.branches.length) {
          let branchNames = response.branches.map(branch => branch.name);
          array.pushObjects(branchNames);
        } else {
          array.pushObject('master');
        }

        array.set('isLoaded', true);
      });

      return array;
    } else {
      // if status images popup is not open, don't fetch any branches
      return [];
    }
  },

  actions: {
    close() {
      return this.get('popup').close();
    }
  },

  @computed('format', 'repo.slug', 'branch')
  statusString(format, slug, branch) {
    const imageFormat = format || this.get('formats.firstObject');
    const gitBranch = branch || 'master';

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
});
