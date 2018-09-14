import Component from '@ember/component';

export default Component.extend({
  tagName: 'a',
  attributeBindings: ['href', 'target', 'rel'],

  rel: 'noopener noreferrer',
  target: '_blank'
});
