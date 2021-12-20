import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { map, gt } from '@ember/object/computed';
import { task, timeout } from 'ember-concurrency';
import config from 'travis/config/environment';
import { EVENTS } from 'travis/utils/dynamic-query';

const { RELOADED } = EVENTS;

export default Component.extend({
  store: service(),
  flashes: service(),
  api: service(),

  showNotificationModal: false,

  toggleButtonText: 'Snooze Notifications',

  isAllSelected: false,
  allowToggle: gt('selectedNotificationIds.length', 0),
  selectedNotificationIds: [],
  selectableNotificationIds: map('notifications', (notification) => notification.id),

  sortField: 'probe_severity',
  sortDirection: 'desc',
  query: '',

  didRender() {
    if (this.notifications && Object.keys(this.notifications.customOptions).length > 0) {
      if (!this.notifications.has(RELOADED)) {
        const self = this;
        this.notifications.on(RELOADED, () => {
          self.set('selectedNotificationIds', []);
          self.set('isAllSelected', false);
        });
      }

      if (this.notifications.customOptions.sort && this.sortField !== this.notifications.customOptions.sort) {
        this.set('sortField', this.notifications.customOptions.sort);
      }
      if (this.notifications.customOptions.sortDirection && this.sortDirection !== this.notifications.customOptions.sortDirection) {
        this.set('sortDirection', this.notifications.customOptions.sortDirection);
      }
    }
  },

  toggleNoifications: task(function* () {
    if (this.selectedNotificationIds.length) {
      const self = this;

      try {
        yield this.api.patch('/insights_notifications/toggle_snooze',  {
          data: {
            notification_ids: this.selectedNotificationIds
          }
        }).then(() => {
          self.notifications.reload();
          self.set('selectedNotificationIds', []);
          self.set('isAllSelected', false);
        });
      } catch (e) {
        this.flashes.error('There was an error toggling notifications. Please try again.');
      }
    }
  }),

  search: task(function* () {
    yield timeout(config.intervals.repositoryFilteringDebounceRate);
    yield this.notifications.applyFilter(this.query);
  }).restartable(),

  setToggleButtonName(selectedIds) {
    let allActive = true, allInactive = true;
    for (const id of selectedIds) {
      const notification = this.notifications.find(obj => obj.id === id);
      allActive = allActive && notification.activeStatus == 'Active';
      allInactive = allInactive && notification.activeStatus == 'Snoozed';
    }

    if (allActive) {
      this.set('toggleButtonText', `Snooze Notification${selectedIds.length > 1 ? 's' : ''}`);
    } else if (allInactive) {
      this.set('toggleButtonText', `Unsnooze Notification${selectedIds.length > 1 ? 's' : ''}`);
    } else {
      this.set('toggleButtonText', `Toggle Notification${selectedIds.length > 1 ? 's' : ''}`);
    }
  },

  actions: {
    openModal(notification) {
      this.set('selectedNotification', notification);
      this.set('showNotificationModal', true);
    },

    reloadNotifications() {
      this.notifications.reload();
    },

    toggleNotification(notificationId) {
      const { selectedNotificationIds } = this;
      const isSelected = selectedNotificationIds.includes(notificationId);

      if (isSelected) {
        selectedNotificationIds.removeObject(notificationId);
      } else {
        selectedNotificationIds.addObject(notificationId);
      }

      this.setToggleButtonName(selectedNotificationIds);
    },

    toggleAll() {
      const { isAllSelected, selectableNotificationIds, selectedNotificationIds } = this;

      if (isAllSelected) {
        this.set('isAllSelected', false);
        selectedNotificationIds.removeObjects(selectableNotificationIds.toArray());
      } else {
        this.set('isAllSelected', true);
        selectedNotificationIds.addObjects(selectableNotificationIds.toArray());
      }

      this.setToggleButtonName(selectedNotificationIds);
    },

    applySort(field) {
      if (field === this.sortField) {
        this.set('sortDirection', this.sortDirection === 'desc' ? 'asc' : 'desc');
      }
      this.set('sortField', field);

      this.notifications.applyCustomOptions({ sort: field, sortDirection: this.sortDirection });
    }
  }
});
