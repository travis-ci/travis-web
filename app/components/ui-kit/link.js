import Component from '@ember/component';

const DEFAULT_TEXT_COLOR = 'blue';

export default Component.extend({
  tagName: '',

  // Public interface
  color: DEFAULT_TEXT_COLOR,

  href: null,
  rel: 'noopener noreferrer',
  target: '_blank',

  route: null,
});
