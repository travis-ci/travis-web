import Component from '@ember/component';
import { computed } from '@ember/object';
import { inject as service } from '@ember/service';
import { empty, reads } from '@ember/object/computed';

export default Component.extend({
  accounts: service(),

  classNames: ['custom-images'],
  customImagesLoading: false,

  init() {
    this._super(...arguments);
    this.set('customImagesLoading', true);
    if (!this.owner.v2subscription) {
      this.accounts.fetchV2Subscriptions.perform();
    }
    this.owner.fetchCustomImages.perform().then(() => {
      this.set('customImagesLoading', false);
    });
  },

  customImages: reads('owner.customImages'),
  isCustomImagesEmpty: empty('customImages'),
  hasCustomImageAllowance: reads('owner.hasCustomImageAllowance'),
  subscription: reads('owner.v2subscription'),

  customImagesCount: reads('customImages.length'),

  customImagesTotalSizeInGB: computed('customImages.@each.sizeBytes', 'subscription', function () {
    let size = 0.0;
    if (this.subscription?.addons) {
      const addon = this.subscription.addons.find(addon =>  addon.type == 'storage');
      if (addon && addon.current_usage) {
        size = addon.current_usage.addon_quantity;
      }
    }
    return `${size.toFixed(2)}`;
  }),

  customImagesUsedSizeInGB: computed('customImages.@each.sizeBytes', function () {
    const size = this.customImages.reduce((total, image) => (total + Math.round(image.sizeBytes / Math.pow(1024, 3) * 100) / 100), 0);
    return `${size.toFixed(2)}`;
  }),

  estimatedCreditsUsage: 0,
});
