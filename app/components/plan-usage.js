import Component from '@ember/component';
import { inject as service } from '@ember/service';
import { computed } from '@ember/object';
import { alias, reads, empty } from '@ember/object/computed';
import moment from 'moment';

export default Component.extend({
  features: service(),
  store: service(),
  download: service(),
  showUserStatisticsModal: false,
  repositoriesVisiblity: null,
  repositoriesVisiblityOptions: ['All repositories', 'Private repositories', 'Public repositories'],
  dateCenter: null,
  dateRange: null,
  showDatePicker: false,
  owner: alias('account'),
  subscription: reads('account.subscription'),
  v2subscription: reads('account.v2subscription'),
  isV2SubscriptionEmpty: empty('v2subscription'),

  init() {
    this._super(...arguments);
    this.repositoriesVisiblity = 'All repositories';
    this.dateCenter = new Date();
    let twoMonthsAgo = new Date();
    twoMonthsAgo.setTime(twoMonthsAgo.getTime() - 60 * 24 * 60 * 60 * 1000);
    this.dateRange = {
      start: twoMonthsAgo,
      end: new Date()
    };
    this.owner.fetchExecutionsPerRepo.perform(moment(this.dateRange.start).format('YYYY-MM-DD'), moment(this.dateRange.end).format('YYYY-MM-DD'));
    this.owner.fetchExecutionsPerSender.perform(moment(this.dateRange.start).format('YYYY-MM-DD'), moment(this.dateRange.end).format('YYYY-MM-DD'));
  },

  summarizedRepositories: computed('summarizedCalculations.repositories', function () {
    let repos = [];
    for (let repoId in this.summarizedCalculations.repositories) {
      const repo = this.summarizedCalculations.repositories[repoId];
      if (typeof repo === 'object')
        repos.push(repo);
    }
    return repos;
  }),

  summarizedMinutesByOs: reads('summarizedCalculations.minutesByOs'),

  totalBuildMinutes: computed('summarizedRepositories', function () {
    return this.summarizedRepositories.reduce((sum, repo) => sum + repo.buildMinutes, 0);
  }),
  totalBuildCredits: computed('summarizedRepositories', function () {
    return this.summarizedRepositories.reduce((sum, repo) => sum + repo.buildCredits, 0);
  }),

  summarizedCalculations: computed('owner.executionsPerRepo', 'repositoriesVisiblity', function () {
    let repositories = [];
    let minutesByOs = [];
    const executions = this.owner.get('executionsPerRepo');

    minutesByOs[getOsIconName('linux')] = 0;
    minutesByOs[getOsIconName('osx')] = 0;
    minutesByOs[getOsIconName('windows')] = 0;
    minutesByOs[getOsIconName('freebsd')] = 0;

    if (executions) {
      executions.forEach(async (execution) => {
        const repo = execution.repository;

        if (this.repositoriesVisiblity === 'All repositories' ||
          (this.repositoriesVisiblity === 'Private repositories' && repo.private === true) ||
          (this.repositoriesVisiblity === 'Public repositories' && repo.private === false)) {
          const minutes = execution.minutes_consumed;
          const credits = execution.credits_consumed;
          const osIcon = getOsIconName(execution.os);
          if (minutesByOs[osIcon]) {
            minutesByOs[osIcon] += minutes;
          } else {
            minutesByOs[osIcon] = minutes;
          }
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
        }
      });
    }
    return {
      repositories: repositories,
      minutesByOs: minutesByOs
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
        const repo = this.store.peekRecord('repo', execution.repository_id) || (await this.store.findRecord('repo', execution.repository_id));
        const sender = this.store.peekRecord('user', execution.sender_id) || (await this.store.findRecord('user', execution.sender_id));
        data.push([
          execution.job_id,
          execution.started_at,
          execution.finished_at,
          execution.os,
          execution.credits_consumed,
          minutes,
          repo.slug,
          repo.ownerName,
          sender.login
        ]);
      });
    }
    return data;
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

    datePicker() {
      this.set('showDatePicker', !this.showDatePicker);
      if (!this.showDatePicker) {
        this.owner.fetchExecutionsPerRepo.perform(moment(this.dateRange.start).format('YYYY-MM-DD'),
          moment(this.dateRange.end || this.dateRange.start).format('YYYY-MM-DD'));
        this.owner.fetchExecutionsPerSender.perform(moment(this.dateRange.start).format('YYYY-MM-DD'),
          moment(this.dateRange.end || this.dateRange.start).format('YYYY-MM-DD'));
      }
    }
  }
});

const calculateMinutes = (start, finish) => (start && finish ? Math.ceil((Date.parse(finish) - Date.parse(start)) / 1000 / 60) : 0);

const getOsIconName = (os) => {
  if (os === 'linux') {
    return 'icon-linux';
  } else if (os === 'freebsd') {
    return 'icon-freebsd';
  } else if (os === 'osx') {
    return 'icon-mac';
  } else if (os === 'windows') {
    return 'icon-windows';
  }  else {
    return 'help';
  }
};
