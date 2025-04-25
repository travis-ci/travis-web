import Component from '@ember/component';
import { computed } from '@ember/object';
import { reads } from '@ember/object/computed';
import config from 'travis/config/environment';

export default Component.extend({
  page: 1,
  get perPage() {
    return config.pagination.customImagesPerPage;
  },

  filter: null,

  isOwnerAdmin: computed('owner', function() {
    const owner = this.owner;
    if (owner.type === 'user') {
      return owner.permissions.sync;
    } else {
      return owner.permissions.admin;
    }
  }),

  selectedImageIds: [],
  allImagesSelected: false,

  filteredCustomImages: computed('customImages', 'filter', function() {
    const { customImages, filter } = this;
    if (filter) {
      return customImages.filter(image => {
        return image.name.toLowerCase().includes(filter.toLowerCase()) || image.createdBy.name.toLowerCase().includes(filter.toLowerCase())
          || image.osVersion.toLowerCase().includes(filter.toLowerCase()) || image.usage.toString() === filter;
      });
    }
    return customImages;
  }),

  customImagesTotalCount: reads('filteredCustomImages.length'),
  customImagesPaginated: computed('filteredCustomImages', 'page', function() {
    const { filteredCustomImages, page, perPage } = this;
    return filteredCustomImages.slice((page - 1) * perPage, page * perPage);
  }),

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

    deleteImage(image) {
    },
    deleteSelectedImages() {
    },

    filterImages(evt) {
      const filter = evt.target.value;
      if (filter.length < 4) {
        this.set('filter', null);
        this.set('page', 1);
        return;
      }

      this.set('filter', filter);
    }
  }
});
