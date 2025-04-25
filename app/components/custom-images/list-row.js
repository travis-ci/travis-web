import Component from '@ember/component';
import { computed } from '@ember/object';

export default Component.extend({
  dropupIsOpen: false,

  isSelected: computed('selectedImageIds', 'image', function() {
    return this.selectedImageIds.includes(this.image.id);
  }),

  openDropup() {
    this.set('dropupIsOpen', true);
  },

  closeDropup() {
    this.set('dropupIsOpen', false);
  },
});
