import Component from '@ember/component';

export default Component.extend({
  tagName: '',

  // Public interface
  variant: 'link-blue',

  href: null,
  rel: 'noopener noreferrer',
  target: '_blank',

  route: null,
});
