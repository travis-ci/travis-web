import Ember from 'ember';
import { format as formatStatusImage } from 'travis/utils/status-image-formats';

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
    return [];
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
