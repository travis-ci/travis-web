import Component from '@ember/component';
import { computed } from 'ember-decorators/object';
import yamlKeyFinder from 'travis/utils/yaml-key-finder';

export default Component.extend({
  @computed('yaml', 'messages.[]')
  annotations(yaml, messages) {
    return messages.reduce((annotations, message) => {
      let code = message.code;
      let key = message.key;

      if (code === 'unknown_key') {
        if (key === 'root') {
          key = message.args.key;
        } else {
          key = `${key}.${message.args.key}`;
        }
      } else if (key === 'root') {
        if (code === 'alias') {
          key = message.args.alias;
        }
      }

      let lineNumber = yamlKeyFinder(yaml, key);

      if (lineNumber === 0 || lineNumber) {
        annotations.push({
          message,
          lineNumber
        });
      }

      return annotations;
    }, []);
  }
});
