/* eslint-disable camelcase */
import Store from '@ember-data/store';
import RequestManager from '@ember-data/request';
import Fetch from '@ember-data/request/fetch';

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
    this.requestManager = new RequestManager();
    this.requestManager.use([Fetch]);
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
  destroy() {
    this.filteredArraysManager.destroy();
    super.destroy();
  }
}
