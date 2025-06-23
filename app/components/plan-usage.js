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

  executionsDataForCsv: computed('owner.executions', function () {
    let data = [];
    const executions = this.owner.get('executions');
    if (executions) {
      executions.forEach(async (execution) => {
        const minutes = calculateMinutes(execution.started_at, execution.finished_at);
        data.push([
          execution.job_id,
          execution.started_at,
          execution.finished_at,
          execution.os,
          execution.credits_consumed,
          minutes,
          execution.repo_slug,
          execution.repo_owner_name,
          execution.sender_login
        ]);
      });
    }
    return data;
  }),

  userLicenseExecutionsDataForCsv: computed('owner.executions', function () {
    const executions = this.owner.get('executions');
    if (!executions) {
      return [];
    }

    let data = [];
    executions.forEach(async (execution) => {
      const sender = this.store.peekRecord('user', execution.sender_id) || (await this.store.findRecord('user', execution.sender_id));
      if (!execution.user_license_credits_consumed) {
        return;
      }

      data.push([
        execution.job_id,
        sender.login,
        execution.user_license_credits_consumed,
        moment(execution.started_at).format('YYYY-MM-DD'),
      ]);
    });

    return data;
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
      excessUsage: usage.excess_usage,
      freeUsage: usage.free_usage,
      quantityLimitCharge: usage.quantity_limit_charge || 0,
      quantityLimitFree: usage.quantity_limit_free || 0,
      quantityLimitType: usage.quantity_limit_type || 0,
      totalUsage: usage.total_usage || 0,
      ownerName: `${this.owner.get('vcsType')} / ${this.owner.get('login')}`,
      name: 'Custom build environment images'
    }));
  }),

  totalExcessStorageUsage: computed('storageUsageItems.@each.excessUsage', function () {
    return this.storageUsageItems.reduce((sum, item) => sum + (item.excessUsage || 0), 0);
  }),

  totalStorageUsage: computed('storageUsageItems.@each.totalUsage', function () {
    return this.storageUsageItems.reduce((sum, item) => sum + (item.totalUsage || 0), 0);
  }),

  actions: {
    async downloadCsv() {
      const startDate = moment(this.dateRange.start).format('YYYY-MM-DD');
      const endDate = moment(this.dateRange.end || this.dateRange.start).format('YYYY-MM-DD');
      const fileName = `usage_${startDate}_${endDate}.csv`;

      await this.owner.fetchExecutions.perform(moment(this.dateRange.start).format('YYYY-MM-DD'),
        moment(this.dateRange.end || this.dateRange.start).format('YYYY-MM-DD'));
      const header = ['Job Id', 'Started at', 'Finished at', 'OS', 'Credits consumed', 'Minutes consumed', 'Repository', 'Owner', 'Sender'];
      const data = this.get('executionsDataForCsv');

      this.download.asCSV(fileName, header, data);
    },

    async downloadUserLicenseCsv() {
      const startDate = moment(this.dateRange.start).format('YYYY-MM-DD');
      const endDate = moment(this.dateRange.end || this.dateRange.start).format('YYYY-MM-DD');
      const fileName = `user_license_usage_${startDate}_${endDate}.csv`;

      await this.owner.fetchExecutions.perform(moment(this.dateRange.start).format('YYYY-MM-DD'),
        moment(this.dateRange.end || this.dateRange.start).format('YYYY-MM-DD'));
      const header = ['Job Id', 'Sender', 'Credits consumed', 'Date'];
      const data = await this.get('userLicenseExecutionsDataForCsv');

      this.download.asCSV(fileName, header, data);
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

const calculateMinutes = (start, finish) => (start && finish ? Math.ceil((Date.parse(finish) - Date.parse(start)) / 1000 / 60) : 0);
