import Controller from '@ember/controller';
import { computed } from 'ember-decorators/object';
import BufferedProxy from 'ember-buffered-proxy/proxy';

export default Controller.extend({
  queryParams: [
    'eventType',
    'commitMessage',
    'yaml',
  ],

  @computed('request.id')
  buffer() {
    return BufferedProxy.create(this);
  },

  actions: {
    submit() {
      this.get('buffer').applyBufferedChanges();
    }
  }
});
