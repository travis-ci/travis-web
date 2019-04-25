import Component from '@ember/component';
import { computed } from '@ember/object';
import { later } from '@ember/runloop';

export default Component.extend({
  copied: false,

  buttonLabel: computed('copied', function () {
    return this.get('copied') ? 'Copied!' : `Copy ${this.fileName}`;
  }),

  fileName: computed('rawConfig', function () {
    let sourcePath = this.get('rawConfig').source;
    let versionedSourceName = sourcePath.substring(sourcePath.lastIndexOf('/') + 1);
    if (!versionedSourceName.length) { return sourcePath; }
    let sourceName = versionedSourceName.substring(0, versionedSourceName.lastIndexOf('@'));
    return sourceName.length ? sourceName : versionedSourceName;
  }),

  actions: {
    copied() {
      this.set('copied', true);
      later(() => this.set('copied', false), 3000);
    }
  }
});
