import Component from '@ember/component';
import { match } from '@ember/object/computed';
import TriggerBuild from 'travis/mixins/trigger-build';

export default Component.extend(TriggerBuild, {
  tagName: 'div',
  classNames: ['repo-config'],
  classNameBindings: ['status'],

  status: 'customize',
  preview: match('status', /preview/),

  onPreview() {
    if (this.preview) {
      this.set('status', 'customize');
    } else {
      this.set('status', 'preview');
    }
  },

  actions: {
    formFieldChanged(field, value) {
      this.set(field, value);
    },

    triggerBuild() {
      if (!this.processing) {
        this.set('processing', true);
        this.submitBuildRequest.perform();
      }
    }
  }
});
