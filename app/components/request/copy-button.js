import ClipboardJS from 'ember-cli-clipboard';
import Component from '@ember/component';
import layout from '../../templates/components/request/copy-button';

export default Component.extend({
  layout: layout,
  classNames: ['copy-button'],

  didInsertElement(element) {
    this.clipboard = this.createClipboard();
  },

  createClipboard() {
    const clipboard = new ClipboardJS(this.element, { text: this.copyText });
    clipboard.on('success', this.success);
    return clipboard;
  },

  willDestroyElement(element) {
    if (this.clipboard) {
      this.clipboard.destroy();
    }
  },

  actions: {
    copy(event) {
      event.stopPropagation();
      this.clipboard.onClick(event);
    },
  },
});
