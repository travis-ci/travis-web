import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  // Public interface
  variant: 'link-underlined',

  href: null,
  rel: 'noopener noreferrer',
  target: '_blank',

  route: null,
});
