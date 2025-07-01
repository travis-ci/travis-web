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

    this.accounts.fetchV2Subscriptions.perform().then(() => {
      this.owner.fetchCustomImages.perform().then(() => {
        this.owner.fetchCurrentImageStorage.perform().then(() => {
          this.owner.fetchStorageExecutionsUsages.perform().then(() => {
            this.set('customImagesLoading', false);
          });
        }).catch((error) => {
          if (error && error.status === 404) {
            this.set('customImagesLoading', false);
          }
        });
      });
    });
  },

  customImages: reads('owner.customImages'),
  isCustomImagesEmpty: empty('customImages'),
  hasCustomImageAllowance: reads('owner.hasCustomImageAllowance'),
  subscription: reads('owner.v2subscription'),
  currentStorage: reads('owner.currentImageStorage'),
  storageExecutionsUsages: reads('owner.storageExecutionsUsages'),

  customImagesCount: reads('customImages.length'),

  customImagesTotalSizeInGB: computed('customImages.@each.sizeBytes', 'subscription', function () {
    let size = 0.0;
    if (this.subscription?.addons) {
      const addon = this.subscription.addons.find(addon =>  addon.type == 'storage');
      if (addon && addon.current_usage) {
        size = addon.current_usage.addon_quantity;
      }
    }
    return `${Math.trunc(size)}`;
  }),

  customImagesUsedSizeInGB: computed('currentStorage', function () {
    return Number.parseFloat(this.currentStorage ? this.currentStorage.current_aggregated_storage : '0').toFixed(2);
  }),

  estimatedCreditsUsage: computed('storageExecutionsUsages.@each.estimated_usage', function () {
    return this.storageExecutionsUsages ? this.storageExecutionsUsages.reduce((accumulator, usage) => accumulator + usage.estimated_usage, 0) : 0;
  }),
});
