import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import { inject as service } from '@ember/service';
import config from 'travis/config/environment';
import moment from 'moment';

export default Component.extend({
  api: service(),
  flashes: service(),

  page: 1,
  get perPage() {
    return config.pagination.customImagesPerPage;
  },

  filter: null,

  isOwnerAdmin: computed('owner', function () {
    const owner = this.owner;
    if (owner.type === 'user') {
      return owner.permissions.sync;
    } else {
      return owner.permissions.admin;
    }
  }),

  selectedImageIds: [],
  allImagesSelected: false,

  showDeleteImageConfirmModal: false,

  filteredCustomImages: computed('customImages', 'filter', function () {
    const { customImages, filter } = this;
    if (filter) {
      return customImages.filter((image) => {
        const createdByName = image.createdBy ? image.createdBy.name || image.createdBy.login : '';
        const createdAt = image.createdAt ? image.createdAt.toString() : '';
        const ago = moment(createdAt).fromNow();
        this.set('page', 1);
        return image.name.toLowerCase().includes(filter.toLowerCase())
          || createdByName.toLowerCase().includes(filter.toLowerCase())
          || (image.osVersion && image.osVersion.toLowerCase().includes(filter.toLowerCase()))
          || image.usage.toString() === filter
          || createdAt.toLowerCase().includes(filter.toLowerCase())
          || ago.toLowerCase().includes(filter.toLowerCase());
      });
    }
    return customImages;
  }),

  customImagesTotalCount: reads('filteredCustomImages.length'),
  customImagesPaginated: computed('filteredCustomImages', 'page', function () {
    const { filteredCustomImages, page, perPage } = this;
    return filteredCustomImages.slice((page - 1) * perPage, page * perPage);
  }),

  deleteImage: task(function* (imageIds) {
    const { owner } = this;
    try {
      yield this.api.delete(`/owner/${owner.provider}/${owner.login}/custom_images`, {
        data: {
          image_ids: imageIds
        }
      });
      this.flashes.success('Custom images deleted successfully');
      this.owner.fetchCustomImages.perform();
    } catch (e) {
      this.flashes.error('Failed to delete custom images');
    }
  }).drop(),

  actions: {
    switchToPage(page) {
      this.set('page', page);
    },

    selectImage(image) {
      const selectedImageIds = this.selectedImageIds;
      const imageId = image.id;

      if (selectedImageIds.includes(imageId)) {
        this.set('selectedImageIds', selectedImageIds.filter(id => id !== imageId));
      } else {
        this.set('selectedImageIds', [...selectedImageIds, imageId]);
      }
    },
    selectAllImages() {
      if (this.allImagesSelected) {
        this.set('allImagesSelected', false);
        this.set('selectedImageIds', []);
        return;
      }

      const allImageIds = this.customImagesPaginated.map(image => image.id);
      this.set('selectedImageIds', allImageIds);
      this.set('allImagesSelected', true);
    },

    closeDeleteImageConfirmModal() {
      this.set('showDeleteImageConfirmModal', false);
      this.set('selectedImageName', null);
      this.set('selectedImageIdsForDeletion', []);
    },

    deleteImage(image) {
      this.set('selectedImageName', image.name);
      this.set('selectedImageIdsForDeletion', [image.id]);
      this.set('showDeleteImageConfirmModal', true);
    },
    deleteSelectedImages() {
      const selectedImageIds = this.selectedImageIds;
      if (selectedImageIds.length > 0) {
        this.set('selectedImageIdsForDeletion', selectedImageIds);
        if (selectedImageIds.length === 1) {
          const selectedImage = this.customImages.find(image => image.id === selectedImageIds[0]);
          this.set('selectedImageName', selectedImage.name);
        } else {
          this.set('selectedImageName', null);
        }
        this.set('showDeleteImageConfirmModal', true);
      }
    },

    deleteImages(imageIds) {
      this.deleteImage.perform(imageIds).then(() => {
        this.set('selectedImageIdsForDeletion', []);
        this.set('showDeleteImageConfirmModal', false);
        this.set('allImagesSelected', false);
        this.set('selectedImageIds', []);
        this.set('page', 1);
      });
    },

    filterImages(evt) {
      const filter = evt.target.value;

      if (filter.length < 4 && isNaN(filter)) {
        this.set('filter', null);
        this.set('page', 1);
        return;
      }

      this.set('filter', filter);
    }
  }
});
