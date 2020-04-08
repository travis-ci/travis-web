import ClipboardJS from 'clipboard';
import Component from '@ember/component';
import layout from 'travis/templates/components/request/copy-button';

export default Component.extend({
  layout,
  tagName: '',

  didInsertElement(element) {
    this.clipboard = this.createClipboard(element);
  },

  createClipboard(element) {
    const clipboard = new ClipboardJS('body', { text: this.copyText });
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
