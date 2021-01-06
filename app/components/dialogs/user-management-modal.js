import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { reads, sort } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import { later } from '@ember/runloop';

export default Component.extend({
  raven: service(),
  flashes: service(),
  perPage: 10,
  selectedUserIds: {},
  filter: '',
  sortField: 'user.name',
  sortWay: 'asc',
  changePermissionsTaskIsRunning: reads('context.changePermissions.isRunning'),
  buildPermissions: reads('context.buildPermissions'),
  filteredBuildPermissions: computed('buildPermissions', 'filter', function () {
    if (this.filter === '') {
      return this.buildPermissions;
    }
    return this.buildPermissions.filter(perm => {
      if ((perm.user.name && perm.user.name.indexOf(this.filter) >= 0) ||
          (perm.user.login && perm.user.login.indexOf(this.filter) >= 0)) {
        return true;
      }
    });
  }),
  filteredBuildPermissionsCount: reads('filteredBuildPermissions.length'),
  sortProps: computed('sortField', 'sortWay', function () {
    return [`${this.sortField}:${this.sortWay}`];
  }),
  sortedBuildPermissions: sort('filteredBuildPermissions', 'sortProps'),

  init() {
    this._super(...arguments);
    this.page = 1;
    this.context.fetchBuildPermissions.perform();
  },

  showPrev: computed('page', 'filteredBuildPermissionsCount', function () {
    return this.page > 1;
  }),

  showNext: computed('page', 'filteredBuildPermissionsCount', function () {
    return this.page < this.maxPages;
  }),

  maxPages: computed('filteredBuildPermissionsCount', function () {
    return Math.ceil(this.filteredBuildPermissionsCount / this.perPage);
  }),

  buildPermissionsToShow: computed('sortedBuildPermissions', 'page', function () {
    return this.sortedBuildPermissions.slice((this.page - 1) * this.perPage, this.page * this.perPage);
  }),

  isAllSelected: computed('selectedUserIds', 'buildPermissionsToShow', function () {
    const selectedUserIds = this.get('selectedUserIds');
    if (Object.keys(selectedUserIds).length === 0) {
      return false;
    }
    return this.buildPermissionsToShow.reduce((previousValue, perm) => (selectedUserIds[perm.user.id] === false ? false : previousValue), true);
  }),

  actions: {
    setPage(newPage) {
      this.set('page', newPage);
    },

    setUserId(id) {
      this.selectedUserIds[id] = !this.selectedUserIds[id];
      this.notifyPropertyChange('selectedUserIds');
    },

    setFilter(event) {
      this.set('filter', event.target.value);
    },

    setAllUserIds() {
      const newState = !this.isAllSelected;
      this.buildPermissionsToShow.forEach(perm => {
        this.selectedUserIds[perm.user.id] = newState;
      });
      this.notifyPropertyChange('selectedUserIds');
    },

    sortList(field) {
      if (this.sortField === field) {
        const newSortWay = this.sortWay === 'asc' ? 'desc' : 'asc';
        this.set('sortWay', newSortWay);
      } else {
        this.set('sortField', field);
        this.set('sortWay', 'asc');
      }
    }
  },

  changePermissions: task(function* (userId, newState) {
    try {
      yield this.context.changePermissions.perform(userId, newState);
    } catch (e) {
      this.raven.logException(e);
      this.flashes.error('There was an error while saving your permissions. Please try again.');
    }
  }).drop(),

  bulkActivate: task(function* () {
    const userIds = [];
    for (let key in this.selectedUserIds) {
      if (this.selectedUserIds[key] === true) {
        userIds.push(parseInt(key));
      }
    }
    try {
      yield this.context.changePermissions.perform(userIds, true);
      this.set('selectedUserIds', {});
      this.notifyPropertyChange('selectedUserIds');
      later(() => this.context.fetchBuildPermissions.perform(), 500);
    } catch (e) {
      this.raven.logException(e);
      this.flashes.error('There was an error while saving your permissions. Please try again.');
    }
  }).drop(),

  bulkDeactivate: task(function* () {
    const userIds = [];
    for (let key in this.selectedUserIds) {
      if (this.selectedUserIds[key] === true) {
        userIds.push(parseInt(key));
      }
    }
    try {
      yield this.context.changePermissions.perform(userIds, false);
      this.set('selectedUserIds', {});
      this.notifyPropertyChange('selectedUserIds');
      later(() => this.context.fetchBuildPermissions.perform(), 500);
    } catch (e) {
      this.raven.logException(e);
      this.flashes.error('There was an error while saving your permissions. Please try again.');
    }
  }).drop(),

  didUpdateAttrs() {
    this._super(...arguments);
    this.page = 1;
    this.set('filter', '');
  },
});
