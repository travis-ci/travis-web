import Component from '@ember/component';
import { computed } from '@ember/object';
import { empty, reads } from '@ember/object/computed';

export default Component.extend({
  classNames: ['custom-images'],
  customImagesLoading: false,

  init() {
    this._super(...arguments);
    this.set('customImagesLoading', true);
    this.owner.fetchCustomImages.perform().then(() => {
      this.set('customImagesLoading', false);
    });
  },

  customImages: reads('owner.customImages'),
  isCustomImagesEmpty: empty('customImages'),
  hasCustomImageAllowance: reads('owner.hasCustomImageAllowance'),

  customImagesCount: reads('customImages.length'),
  customImagesTotalSizeInGB: computed('customImages.@each.sizeBytes', function () {
    const size = this.customImages.reduce((total, image) => (total + Math.round(image.sizeBytes / Math.pow(1024, 3) * 100) / 100), 0);
    return `${size.toFixed(2)} GB`;
  }),

  estimatedCreditsUsage: 0,
});
