/* eslint-disable camelcase */
import Store from '@ember-data/store';
import PaginatedCollectionPromise from 'travis/utils/paginated-collection-promise';
import { inject as service } from '@ember/service';
import FilteredArrayManager from 'travis/utils/filtered-array-manager';
import fetchLivePaginatedCollection from 'travis/utils/fetch-live-paginated-collection';

export default class ExtendedStore extends Store {
  @service auth;

  defaultAdapter = 'application';
  adapter = 'application';

  constructor() {
    super(...arguments);
    this.shouldAssertMethodCallsOnDestroyedStore = true;
    this.filteredArraysManager = FilteredArrayManager.create({ store: this });
  }

  filter(modelName, queryParams, filterFunction, dependencies, forceReload) {
    if (arguments.length === 0) {
      throw new Error('store.filter called with no arguments');
    }
    if (arguments.length === 1) {
      return this.peekAll(modelName);
    }
    if (arguments.length === 2) {
      filterFunction = queryParams;
      return this.filteredArraysManager.filter(modelName, null, filterFunction, ['']);
    }

    if (!dependencies) {
      console.log("No dependency");
      console.log(this.filteredArraysManager);
      console.log(this.filteredArraysManager.filter);
      return this.filteredArraysManager.filter(modelName, queryParams, filterFunction, ['']);
    } else {
      return this.filteredArraysManager.fetchArray(modelName, queryParams, filterFunction, dependencies, forceReload);
    }
  }

  paginated(modelName, queryParams, options = {}) {
    let allowLive = !options.hasOwnProperty('live') || options.live;
    if (!parseInt(queryParams.offset) && allowLive) {
      // we're on the first page, live updates can be enabled
      return fetchLivePaginatedCollection(this, ...arguments);
    } else {
      return PaginatedCollectionPromise.create({
        content: this.query(...arguments)
      });
    }
  }

  _pushInternalModel(data) {
    let type = data.type;
    let newUpdatedAt = data.attributes ? data.attributes.updatedAt : null;

    if (newUpdatedAt) {
      let internalModel = this._internalModelForId(type, data.id),
        record = internalModel.getRecord(),
        existingUpdatedAt = record.get('updatedAt');

      if (!existingUpdatedAt || existingUpdatedAt <= newUpdatedAt) {
        return super._pushInternalModel(...arguments);
      } else {
        // record to push is older than the existing one, we need to skip,
        // but we still need to return the result
        return internalModel;
      }
    } else {
      return super._pushInternalModel(...arguments);
    }
  }

  destroy() {
    this.filteredArraysManager.destroy();
    super.destroy();
  }
}
