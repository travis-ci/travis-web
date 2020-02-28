import Component from '@ember/component';
import { computed } from '@ember/object';
import { assert } from '@ember/debug';
import { requireProp } from 'travis/utils/ui-kit/assertions';

export default Component.extend({
  tagName: '',

  path: null,
  svg: null,
  alt: null,

  display: 'inline-block',
  margin: null,
  height: null,
  width: null,

  fullPath: computed('path', function () {
    return `../images/${this.path}`;
  }),

  // Lifecycle
  didReceiveAttrs() {
    this._super(...arguments);

    assert('The @path or @svg property must be present on this Image component.', this.path || this.svg);

    requireProp(this.alt, '@alt', 'Image');
  },
});
