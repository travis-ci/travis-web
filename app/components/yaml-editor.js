import Component from '@ember/component';
import { computed, observes } from 'ember-decorators/object';
import yamlKeyFinder from 'travis/utils/yaml-key-finder';

export default Component.extend({
  @observes('highlightedKey')
  highlightedKeyDidChange() {
    let key = this.get('highlightedKey');

    let yaml = this.get('yaml');
    let yamlLines = yaml.split('\n');

    if (key) {
      let keyIndex = yamlKeyFinder(yaml, key);

      if (keyIndex >= -1) {
        let line = yamlLines[keyIndex];
        yamlLines[keyIndex] = `<mark>${line}</mark>`;
      }
    }

    let highlights = this.$('.highlights');
    highlights.html(yamlLines.join('\n'));
  },

  @computed('yaml', 'messages.[]')
  annotations(yaml, messages) {
    return messages.reduce((annotations, message) => {
      let key = message.key;
      let lineNumber = yamlKeyFinder(yaml, key);

      if (lineNumber >= 0) {
        annotations.push({
          message,
          lineNumber
        });
      }

      return annotations;
    }, []);
  }
});
