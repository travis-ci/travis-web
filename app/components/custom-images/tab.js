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

  customImagesCount: reads('customImages.length'),
  customImagesTotalSizeInGB: computed('customImages.@each.sizeBytes', function () {
    const size = this.customImages.reduce((total, image) => total + image.sizeBytes, 0);
    return `${(size / Math.pow(1024, 3)).toFixed(2)} GB`;
  }),

  estimatedCreditsUsage: 0,
});
