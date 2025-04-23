import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';

export default Component.extend({
  classNames: ['custom-images'],

  customImages: reads('owner.customImages'),
  isCustomImagesEmpty: computed('customImages.length', function() {
    return this.customImages.length === 0;
  }),

  customImagesCount: reads('customImages.length'),
  customImagesTotalSizeInGB: computed('customImages.@each.usage', function() {
    const size = this.customImages.reduce((total, image) => {
      return total + image.usage;
    }, 0);
    return `${(size / Math.pow(1024, 3)).toFixed(2)} GB`;
  }),

  estimatedCreditsUsage: 0,
});
