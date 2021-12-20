import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { reads } from '@ember/object/computed';
import { computed } from '@ember/object';

const NOTIFICATIONS_FILTER_LABELS = {
  'active': 'Active Notifications',
  'all': 'All Notifications',
  'snooze': 'Snoozed Notifications'
};

export default Component.extend({
  store: service(),
  accounts: service(),

  owner: reads('accounts.user'),

  notificationFilterLabel: 'Active Notifications',
  notificationFilter: 'active',
  lastScanEndedAt: null,

  notifications: reads('owner.insightsNotifications'),

  didRender() {
    if (this.notifications && Object.keys(this.notifications.customOptions).length > 0) {
      if (this.notifications.customOptions.active === 'all') {
        this.set('notificationFilter', 'all');
        this.set('notificationFilterLabel', NOTIFICATIONS_FILTER_LABELS['all']);
      } else if (this.notifications.customOptions.active === 'yes') {
        this.set('notificationFilter', 'snooze');
        this.set('notificationFilterLabel', NOTIFICATIONS_FILTER_LABELS['snooze']);
      } else if (this.notifications.customOptions.active === 'no') {
        this.set('notificationFilter', 'active');
        this.set('notificationFilterLabel', NOTIFICATIONS_FILTER_LABELS['active']);
      }
    }
  },

  actions: {
    setFilter(filter, dropdown) {
      dropdown.actions.close();
      this.set('notificationFilter', filter);
      this.set('notificationFilterLabel', NOTIFICATIONS_FILTER_LABELS[filter]);
      if (filter === 'active') {
        this.notifications.applyCustomOptions({ active: 'no' });
      } else if (filter === 'snooze') {
        this.notifications.applyCustomOptions({ active: 'yes' });
      } else {
        this.notifications.applyCustomOptions({ active: 'all' });
      }
    }
  },

  notificationCount: computed('notifications.[]', function () {
    let count = {
      'info': 0,
      'low': 0,
      'med': 0,
      'high': 0,
      'total': 0
    };

    this.notifications.forEach(notification => {
      switch (notification.probeSeverity) {
        case 'info':
          count.info++;
          break;
        case 'low':
          count.low++;
          break;
        case 'med':
          count.med++;
          break;
        case 'high':
          count.high++;
          break;
      }
      count.total++;
    });

    return count;
  }),
});
