import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  stopBubble(event) {
    event.stopPropagation();
  },
});
