import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { alias, reads, empty } from '@ember/object/computed';
import { task } from 'ember-concurrency';
import moment from 'moment';

export default Component.extend({
  features: service(),
  store: service(),
  insights: service(),
  download: service(),
  showUserStatisticsModal: false,
  insightsCurrentRange: null,
  insightsRangeOptions: ['Last Week', 'Last Month'],
  dateCenter: null,
  dateRange: null,
  showDatePicker: false,
  owner: alias('account'),
  subscription: reads('account.subscription'),
  v2subscription: reads('account.v2subscription'),
  isV2SubscriptionEmpty: empty('v2subscription'),
  isOrganization: reads('owner.isOrganization'),
  api: service(),
  auth: service(),
  currentUser: reads('auth.currentUser'),
  flashes: service(),

  isGeneratingReport: false,

  init() {
    this._super(...arguments);
    this.dateCenter = new Date();
    this.interval = 'week';
    this.insightsCurrentRange = this.insightsRangeOptions[0];
    let weekAgo = new Date();
    weekAgo.setTime(weekAgo.getTime() - 7 * 24 * 60 * 60 * 1000);
    this.dateRange = {
      start: weekAgo,
      end: new Date()
    };
    this.owner.fetchExecutionsPerRepo.perform(moment(this.dateRange.start).format('YYYY-MM-DD'), moment(this.dateRange.end).format('YYYY-MM-DD'));
    this.owner.fetchExecutionsPerSender.perform(moment(this.dateRange.start).format('YYYY-MM-DD'), moment(this.dateRange.end).format('YYYY-MM-DD'));
    this.owner.fetchCustomImageUsages.perform(moment(this.dateRange.start).format('YYYY-MM-DD'), moment(this.dateRange.end).format('YYYY-MM-DD'));
    this.requestRepositoryData.perform();
  },

  requestRepositoryData: task(function* () {
    return yield this.insights.getChartData.perform(
      this.owner,
      this.interval,
      'builds',
      'sum',
      ['count_started'],
      {calcAvg: true, private: true}
    );
  }).drop(),

  summarizedRepositories: computed('summarizedCalculations.repositories', function () {
    let repos = [];
    for (let repoId in this.summarizedCalculations.repositories) {
      const repo = this.summarizedCalculations.repositories[repoId];
      if (typeof repo === 'object')
        repos.push(repo);
    }
    return repos;
  }),

  summarizedUsers: computed('summarizedOwnerCalculations.users', function () {
    let users = [];
    for (let userId in this.summarizedOwnerCalculations.users) {
      const user = this.summarizedOwnerCalculations.users[userId];
      if (typeof user === 'object') {
        users.push(user);
      }
    }
    return users;
  }),

  totalBuildMinutes: computed('summarizedRepositories', function () {
    return this.summarizedRepositories.reduce((sum, repo) => sum + repo.buildMinutes, 0);
  }),
  totalBuildCredits: computed('summarizedRepositories', function () {
    return this.summarizedRepositories.reduce((sum, repo) => sum + repo.buildCredits, 0);
  }),


  summarizedCalculations: computed('owner.executionsPerRepo', function () {
    let repositories = [];
    const executions = this.owner.get('executionsPerRepo');

    if (executions) {
      executions.forEach(async (execution) => {
        const repo = execution.repository;

        const minutes = execution.minutes_consumed;
        const credits = execution.credits_consumed;
        if (repositories[`'${execution.repository_id}'`]) {
          repositories[`'${execution.repository_id}'`].buildMinutes += minutes;
          repositories[`'${execution.repository_id}'`].buildCredits += credits;
        } else {
          repositories[`'${execution.repository_id}'`] = {
            name: repo.name,
            provider: repo.vcs_type.replace('Repository', '').toLowerCase(),
            urlOwnerName: repo.owner_name,
            formattedSlug: repo.slug.replace('/', ' / '),
            urlName: repo.slug.split('/').lastObject,
            buildMinutes: minutes,
            buildCredits: credits
          };
        }
      });
    }
    return {
      repositories: repositories,
    };
  }),

  summarizedOwnerCalculations: computed('owner.executionsPerSender', function () {
    let users = [];
    const executions = this.owner.get('executionsPerSender');

    if (executions) {
      executions.forEach(async (execution) => {
        const sender = execution.sender;
        const minutes = execution.minutes_consumed;
        const credits = execution.credits_consumed;
        if (users[`'${execution.sender_id}'`]) {
          users[`'${execution.sender_id}'`].buildMinutes += minutes;
          users[`'${execution.sender_id}'`].buildCredits += credits;
        } else {
          users[`'${execution.sender_id}'`] = {
            login: sender.login,
            name: sender.name,
            buildMinutes: minutes,
            buildCredits: credits,
            internal: sender.internal,
            provider: sender.vcs_type?.replace('User', '')?.toLowerCase()
          };
        }
      });
    }
    return {
      users: users,
    };
  }),

  invoices: computed('subscription.id', 'v2subscription.id', function () {
    const subscriptionId = this.isV2SubscriptionEmpty ? this.get('subscription.id') : this.get('v2subscription.id');
    const type = this.isV2SubscriptionEmpty ? 1 : 2;
    if (subscriptionId) {
      return this.store.query('invoice', { type, subscriptionId });
    } else {
      return [];
    }
  }),

  lastInvoice: computed('invoices.[]', function () {
    return this.invoices && this.invoices.lastObject ? this.invoices.lastObject : null;
  }),

  sortedAddons: computed('subscription.addons.[]', function () {
    const addons = this.get('subscription.addons') || [];

    return addons.slice().sort((a, b) => {
      const getTypePriority = (addon) => {
        if (addon.type === 'credit_public' || addon.type === 'credit_private') {
          return 1; // Credit type come first
        } else if (addon.type === 'user_license') {
          return addon.free ? 2 : 3; // Free user_license comes before paid
        }
        return 4;
      };

      const priorityA = getTypePriority(a);
      const priorityB = getTypePriority(b);

      return priorityA - priorityB;
    });
  }),

  storageAddonUsage: reads('subscription.storageAddon.current_usage'),

  storageAddonTotalUsage: computed('storageAddonUsage', function () {
    return this.storageAddonUsage.addon_usage || 0;
  }),

  storageUsageItems: computed('owner.customImageUsages', function () {
    const usages = this.owner.get('customImageUsages');
    if (!usages) {
      return [];
    }

    return usages.map((usage) => ({
      excessUsage: Math.ceil(usage.excess_usage || 0),
      freeUsage: Math.ceil(usage.free_usage),
      quantityLimitCharge: usage.quantity_limit_charge || 0,
      quantityLimitFree: usage.quantity_limit_free || 0,
      quantityLimitType: usage.quantity_limit_type || 0,
      totalUsage: Math.ceil(usage.total_usage || 0)
    }));
  }),

  storageUsageItemsOwners: computed('owner.customImageUsages', function () {
    const usages = this.owner.get('customImageUsages');
    if (!usages) {
      return [];
    }

    const usagesByOwner = [];
    usages.forEach((usage) => {
      usage.usage_by_owner.forEach((item) => {
        usagesByOwner.push({
          totalUsage: Math.ceil(item.total_usage || 0),
          ownerName: `${item.vcs_type} / ${item.login}`,
        });
      });
    });

    return usagesByOwner;
  }),

  totalExcessStorageUsage: computed('storageUsageItems.@each.excessUsage', function () {
    return this.storageUsageItems.reduce((sum, item) => sum + (item.excessUsage || 0), 0);
  }),

  totalStorageUsage: computed('storageUsageItems.@each.totalUsage', function () {
    return this.storageUsageItems.reduce((sum, item) => sum + (item.totalUsage || 0), 0);
  }),

  actions: {
    requestCsvExport() {
      this.set('isGeneratingReport', true);

      const owner = this.get('owner');
      const provider = owner.get('provider') || 'github'; // Default to github if not set
      const login = owner.get('login');
      const email = this.get('currentUser.email');
      const url = `/owner/${provider}/${login}/csv_exports`;
      const startDate = moment(this.dateRange.start).format('YYYY-MM-DD');
      const endDate = moment(this.dateRange.end).format('YYYY-MM-DD');

      this.api.post(url, {
        data: {
          csv_export: {
            recipient_email: email,
            expires_in: 86400, // 24 hours in seconds
            start_date: startDate,
            end_date: endDate
          }
        }
      }).then(() => {
        this.flashes.warning(
          `We're generating your report. We'll email it to ${email} when ready.`);
      }).catch(error => {
        this.flashes.error(
          `Error: ${error.message}. Please try again.`);
      }).finally(() => {
        this.set('isGeneratingReport', false);
      });
    },

    async changeInsightsRange(opt) {
      this.set('insightsCurrentRange', opt);
      this.set('interval', opt == this.insightsRangeOptions[0] ? 'week' : 'month');

      let range = new Date();
      const distance = opt == this.insightsRangeOptions[0] ? 7 : 30;
      range.setTime(range.getTime() - distance * 24 * 60 * 60 * 1000);
      this.dateRange = {
        start: range,
        end: new Date()
      };
      this.owner.fetchExecutionsPerRepo.perform(moment(this.dateRange.start).format('YYYY-MM-DD'), moment(this.dateRange.end).format('YYYY-MM-DD'));
      this.owner.fetchExecutionsPerSender.perform(moment(this.dateRange.start).format('YYYY-MM-DD'), moment(this.dateRange.end).format('YYYY-MM-DD'));
      this.owner.fetchCustomImageUsages.perform(moment(this.dateRange.start).format('YYYY-MM-DD'), moment(this.dateRange.end).format('YYYY-MM-DD'));
      this.requestRepositoryData.perform();
    }

  }
});
