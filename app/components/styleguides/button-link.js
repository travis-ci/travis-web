import Button from 'travis/components/styleguides/button';

export default Button.extend({
  tagName: 'a',
  attributeBindings: ['href', 'target', 'rel', 'title'],

  role: 'link',
  type: '',
  rel: 'noopener noreferrer',
  target: '_blank',

  onToggle() {},
});
