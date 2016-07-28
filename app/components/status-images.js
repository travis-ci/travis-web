import Ember from 'ember';
import { format as formatStatusImage } from 'travis/utils/status-image-formats';
import Config from 'travis/config/environment';

const { service } = Ember.inject;
const { alias } = Ember.computed;

export default Ember.Component.extend({
  popup: service(),
  auth: service(),

  popupName: alias('popup.popupName'),

  id: 'status-images',
  attributeBindings: ['id'],
  classNames: ['popup', 'status-images'],
  formats: ['Image URL', 'Markdown', 'Textile', 'Rdoc', 'AsciiDoc', 'RST', 'Pod', 'CCTray'],

  branches: Ember.computed('popupName', 'repo', function () {
    let repoId = this.get('repo.id'),
      popupName = this.get('popupName');

    if (popupName === 'status-images') {
      let array = Ember.ArrayProxy.create({ content: [] }),
        apiEndpoint = Config.apiEndpoint,
        options = {};

      array.set('isLoaded', false);

      if (this.get('auth.signedIn')) {
        options.headers = {
          Authorization: `token ${this.auth.token()}`
        };
      }

      let url = `${apiEndpoint}/v3/repo/${repoId}/branches?limit=100`;
      Ember.$.ajax(url, options).then(response => {
        if (response.branches.length) {
          array.pushObjects(response.branches.map((branch) => { branch.name; }));
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
  }),

  actions: {
    close() {
      return this.get('popup').close();
    }
  },

  statusString: Ember.computed('format', 'repo.slug', 'branch', function () {
    let format = this.get('format') || this.get('formats.firstObject'),
      branch = this.get('branch') || 'master';

    return formatStatusImage(format, this.get('repo.slug'), branch);
  })
});
