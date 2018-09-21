import Component from '@ember/component';
import { observes } from 'ember-decorators/object';

export default Component.extend({
  @observes('highlightedKey')
  highlightedKeyDidChange() {
    let key = this.get('highlightedKey');

    let yaml = this.get('yaml');
    let yamlLines = yaml.split('\n');

    let keyIndex = yamlLines.findIndex(line => line.startsWith(key));

    let highlights = this.$('.highlights');

    if (keyIndex >= -1) {
      let line = yamlLines[keyIndex];
      yamlLines[keyIndex] = `<mark>${line}</mark>`;
    }

    highlights.html(yamlLines.join('\n'));
  }
});
