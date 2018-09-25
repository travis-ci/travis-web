import Controller from '@ember/controller';
import { computed } from 'ember-decorators/object';
import yamlKeyFinder from 'travis/utils/yaml-key-finder';
import BufferedProxy from 'ember-buffered-proxy/proxy';

export default Controller.extend({
  queryParams: [
    'eventType',
    'commitMessage',
    'yaml',
  ],

  @computed('request.id')
  buffer() {
    return BufferedProxy.create({content: this});
  },

  @computed('buffer.yaml', 'build.request.messages.[]')
  annotations(yaml, messages) {
    return messages.reduce((annotations, message) => {
      let code = message.code;
      let key = message.key;

      if (code === 'unknown_key' || code === 'empty') {
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
  },

  @computed('annotations.@each.message', 'build.request.messages.[]')
  messagesWithoutAnnotations() {
    let messagesWithAnnotations = this.get('annotations').mapBy('message');
    return this.get('build.request.messages')
      .reject(message => messagesWithAnnotations.includes(message));
  },

  @computed('messagesWithoutAnnotations.[]')
  requestForMessagesWithoutAnnotations() {
    return {
      messages: this.get('messagesWithoutAnnotations')
    };
  },

  actions: {
    submit() {
      this.get('buffer').applyBufferedChanges();
    }
  }
});
